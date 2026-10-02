import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { hashString, mulberry32, nid, shuffle } from "@/lib/utils";
import {
  formatAnswer,
  formatCorrectAnswer,
  isAnswered,
  scoreQuestion,
  stripAnswerKey,
} from "@/lib/scoring";
import type {
  AnswerValue,
  AttemptSummary,
  ExamQuestion,
  QuestionPayload,
  QuestionRecord,
  QuizMode,
} from "@/lib/types";
import { AppError, ensureProfile, jsonText, loadQuestions, requireActiveUser } from "./helpers";
import { ensureSeeded } from "./seed";

const answerSchema = z.union([
  z.object({ optionId: z.string() }),
  z.object({ optionIds: z.array(z.string()) }),
  z.object({ pairs: z.record(z.string(), z.string()) }),
  z.object({ itemIds: z.array(z.string()) }),
  z.object({ blanks: z.record(z.string(), z.string()) }),
]);

type AttemptRow = {
  id: string;
  user_id: string;
  quiz_id: string;
  attempt_number: number;
  mode: QuizMode;
  status: AttemptSummary["status"];
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  duration_seconds: number;
  time_used_seconds: number | null;
  score: string | number | null;
  max_score: string | number | null;
  percentage: string | number | null;
  passed: boolean | null;
  correct_count: number | null;
  incorrect_count: number | null;
  unanswered_count: number | null;
  question_order: string[] | string;
  title?: string;
};

function parseJson<T>(value: T | string | null | undefined, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value;
}

function mapAttempt(row: AttemptRow, title = row.title ?? ""): AttemptSummary {
  return {
    id: row.id,
    quizId: row.quiz_id,
    quizTitle: title,
    attemptNumber: row.attempt_number,
    mode: row.mode,
    status: row.status,
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    submittedAt: row.submitted_at,
    durationSeconds: row.duration_seconds,
    timeUsedSeconds: row.time_used_seconds,
    score: row.score == null ? null : Number(row.score),
    maxScore: row.max_score == null ? null : Number(row.max_score),
    percentage: row.percentage == null ? null : Number(row.percentage),
    passed: row.passed,
    correctCount: row.correct_count,
    incorrectCount: row.incorrect_count,
    unansweredCount: row.unanswered_count,
  };
}

function remainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function applyOrder(question: QuestionRecord, order: Record<string, string[]>): ExamQuestion {
  const stripped = stripAnswerKey(question.type, question.payload);
  const exam: ExamQuestion = {
    id: question.id,
    type: question.type,
    stem: question.stem,
    instruction: question.instruction,
    points: question.points,
    requiredAnswers: question.requiredAnswers,
    ...stripped,
  };
  if (exam.options && order.optionIds?.length) {
    const map = new Map(exam.options.map((o) => [o.id, o]));
    exam.options = order.optionIds.map((id) => map.get(id)).filter(Boolean) as typeof exam.options;
  }
  if (exam.sources && order.sourceIds?.length) {
    const map = new Map(exam.sources.map((o) => [o.id, o]));
    exam.sources = order.sourceIds.map((id) => map.get(id)).filter(Boolean) as typeof exam.sources;
  }
  if (exam.targets && order.targetIds?.length) {
    const map = new Map(exam.targets.map((o) => [o.id, o]));
    exam.targets = order.targetIds.map((id) => map.get(id)).filter(Boolean) as typeof exam.targets;
  }
  if (exam.orderItems && order.itemIds?.length) {
    const map = new Map(exam.orderItems.map((o) => [o.id, o]));
    exam.orderItems = order.itemIds.map((id) => map.get(id)).filter(Boolean) as typeof exam.orderItems;
  }
  if (exam.blanks && order.blankIds?.length) {
    const map = new Map(exam.blanks.map((o) => [o.id, o]));
    exam.blanks = order.blankIds.map((id) => map.get(id)).filter(Boolean) as typeof exam.blanks;
  }
  return exam;
}

function buildOrder(question: QuestionRecord, rng: () => number, randomize: boolean) {
  const p = question.payload;
  const order: Record<string, string[]> = {};
  if (p.options) order.optionIds = randomize ? shuffle(p.options.map((o) => o.id), rng) : p.options.map((o) => o.id);
  if (p.sources) order.sourceIds = randomize ? shuffle(p.sources.map((o) => o.id), rng) : p.sources.map((o) => o.id);
  if (p.targets) order.targetIds = randomize ? shuffle(p.targets.map((o) => o.id), rng) : p.targets.map((o) => o.id);
  if (p.orderItems) {
    order.itemIds = randomize
      ? shuffle(p.orderItems.map((o) => o.id), rng)
      : p.orderItems.map((o) => o.id);
  }
  if (p.blanks) order.blankIds = p.blanks.map((b) => b.id);
  return order;
}

async function finalizeAttempt(attemptId: string, status: "SUBMITTED" | "EXPIRED") {
  const sql = await getSql();
  const attemptRows = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [attemptId]);
  const attempt = attemptRows[0];
  if (!attempt) throw new AppError("Attempt not found", 404);
  if (attempt.status === "SUBMITTED" || attempt.status === "EXPIRED") return mapAttempt(attempt);

  const aq = await sql.query<{ question_id: string; snapshot: QuestionRecord | string }>(
    `select question_id, snapshot from attempt_questions where attempt_id = $1`,
    [attemptId],
  );
  const answers = await sql.query<{ question_id: string; answer: AnswerValue | string }>(
    `select question_id, answer from attempt_answers where attempt_id = $1`,
    [attemptId],
  );
  const answerMap = new Map(answers.map((a) => [a.question_id, parseJson<AnswerValue | null>(a.answer, null)]));

  let score = 0;
  let maxScore = 0;
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  const quiz = await sql.query<{ passing_percentage: number }>(
    `select passing_percentage from quizzes where id = $1`,
    [attempt.quiz_id],
  );
  const passing = quiz[0]?.passing_percentage ?? 70;

  for (const row of aq) {
    const snap = parseJson<QuestionRecord>(row.snapshot, null as unknown as QuestionRecord);
    if (!snap) continue;
    const payload = snap.payload as QuestionPayload;
    const ans = answerMap.get(row.question_id) ?? null;
    const result = scoreQuestion({
      type: snap.type,
      points: Number(snap.points),
      scoringMode: snap.scoringMode,
      requiredAnswers: snap.requiredAnswers,
      payload,
      answer: ans,
    });
    maxScore += result.maxPoints;
    score += result.pointsAwarded;
    if (!isAnswered(snap.type, ans)) unanswered += 1;
    else if (result.isCorrect) correct += 1;
    else incorrect += 1;
    await sql.query(
      `insert into attempt_answers (id, attempt_id, question_id, answer, is_correct, points_awarded)
       values ($1,$2,$3,$4::jsonb,$5,$6)
       on conflict (attempt_id, question_id) do update set is_correct = $5, points_awarded = $6`,
      [nid("ans"), attemptId, row.question_id, jsonText(ans ?? {}), result.isCorrect, result.pointsAwarded],
    );
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 10000) / 100 : 0;
  const started = new Date(attempt.started_at).getTime();
  const used = Math.max(1, Math.round((Date.now() - started) / 1000));
  await sql.query(
    `update quiz_attempts set
      status = $2, submitted_at = now(), time_used_seconds = $3, score = $4, max_score = $5,
      percentage = $6, passed = $7, correct_count = $8, incorrect_count = $9, unanswered_count = $10, updated_at = now()
     where id = $1`,
    [
      attemptId,
      status,
      Math.min(used, attempt.duration_seconds),
      score,
      maxScore,
      percentage,
      percentage >= passing,
      correct,
      incorrect,
      unanswered,
    ],
  );
  const next = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [attemptId]);
  return mapAttempt(next[0]);
}

async function expireIfNeeded(row: AttemptRow): Promise<AttemptRow> {
  if (row.status !== "IN_PROGRESS") return row;
  if (new Date(row.expires_at).getTime() > Date.now()) return row;
  await finalizeAttempt(row.id, "EXPIRED");
  const sql = await getSql();
  const next = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [row.id]);
  return next[0];
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    return ensureProfile(context.userId, null, null);
  });

export const startAttempt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ quizId: z.string(), mode: z.enum(["PRACTICE", "EXAM"]) }))
  .handler(async ({ context, data }) => {
    await ensureSeeded();
    await requireActiveUser(context.userId);
    const sql = await getSql();
    const quizRows = await sql.query<{
      id: string;
      published: boolean;
      active: boolean;
      archived: boolean;
      time_limit_seconds: number;
      allow_retake: boolean;
      max_attempts: number | null;
      randomize_questions: boolean;
      randomize_options: boolean;
      title: string;
    }>(`select * from quizzes where id = $1`, [data.quizId]);
    const quiz = quizRows[0];
    if (!quiz || !quiz.published || !quiz.active || quiz.archived) throw new AppError("Quiz not available", 404);

    const open = await sql.query<AttemptRow>(
      `select * from quiz_attempts where user_id = $1 and quiz_id = $2 and status = 'IN_PROGRESS' order by started_at desc limit 1`,
      [context.userId, data.quizId],
    );
    if (open[0]) {
      const current = await expireIfNeeded(open[0]);
      if (current.status === "IN_PROGRESS") return { attemptId: current.id, resumed: true };
    }

    const done = await sql.query<{ n: number }>(
      `select count(*)::int as n from quiz_attempts where user_id = $1 and quiz_id = $2 and status in ('SUBMITTED','EXPIRED')`,
      [context.userId, data.quizId],
    );
    const used = done[0]?.n ?? 0;
    if (!quiz.allow_retake && used > 0) throw new AppError("Retakes are not allowed for this quiz");
    if (quiz.max_attempts != null && used >= quiz.max_attempts) throw new AppError("No attempts remaining");

    const questions = await loadQuestions(quiz.id, true);
    if (questions.length === 0) throw new AppError("This quiz has no published questions");

    const rng = mulberry32(hashString(`${context.userId}:${Date.now()}:${quiz.id}`));
    const ordered = quiz.randomize_questions ? shuffle(questions, rng) : questions;
    const attemptId = nid("att");
    const duration = quiz.time_limit_seconds;
    await sql.query(
      `insert into quiz_attempts (
        id, user_id, quiz_id, attempt_number, mode, status, started_at, expires_at, duration_seconds, question_order
      ) values ($1,$2,$3,$4,$5,'IN_PROGRESS', now(), now() + ($6::text || ' seconds')::interval, $6, $7::jsonb)`,
      [
        attemptId,
        context.userId,
        quiz.id,
        used + 1,
        data.mode,
        duration,
        jsonText(ordered.map((q) => q.id)),
      ],
    );
    for (let i = 0; i < ordered.length; i += 1) {
      const q = ordered[i];
      const optionOrder = buildOrder(q, rng, quiz.randomize_options);
      await sql.query(
        `insert into attempt_questions (id, attempt_id, question_id, position, marked, option_order, snapshot)
         values ($1,$2,$3,$4,false,$5::jsonb,$6::jsonb)`,
        [nid("aq"), attemptId, q.id, i, jsonText(optionOrder), jsonText(q)],
      );
    }
    return { attemptId, resumed: false };
  });

export const getExamState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ attemptId: z.string() }))
  .handler(async ({ context, data }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql.query<AttemptRow & { title: string; allow_back_navigation: boolean }>(
      `select a.*, q.title, q.allow_back_navigation
       from quiz_attempts a join quizzes q on q.id = a.quiz_id
       where a.id = $1`,
      [data.attemptId],
    );
    const attempt = rows[0];
    if (!attempt || attempt.user_id !== context.userId) throw new AppError("Attempt not found", 404);
    const current = await expireIfNeeded(attempt);
    const aq = await sql.query<{
      question_id: string;
      position: number;
      marked: boolean;
      option_order: Record<string, string[]> | string;
      snapshot: QuestionRecord | string;
    }>(`select question_id, position, marked, option_order, snapshot from attempt_questions where attempt_id = $1 order by position`, [
      current.id,
    ]);
    const answers = await sql.query<{ question_id: string; answer: AnswerValue | string }>(
      `select question_id, answer from attempt_answers where attempt_id = $1`,
      [current.id],
    );
    const answerMap = new Map(answers.map((a) => [a.question_id, parseJson<AnswerValue | null>(a.answer, null)]));
    const questions: ExamQuestion[] = [];
    const navigator: { id: string; marked: boolean; answered: boolean }[] = [];
    const feedback: Record<string, { correct: boolean; explanation: string; correctAnswer: string } | undefined> =
      {};

    for (const row of aq) {
      const snap = parseJson<QuestionRecord>(row.snapshot, null as unknown as QuestionRecord);
      const order = parseJson<Record<string, string[]>>(row.option_order, {});
      if (!snap) continue;
      questions.push(applyOrder(snap, order));
      const ans = answerMap.get(row.question_id) ?? null;
      navigator.push({
        id: row.question_id,
        marked: Boolean(row.marked),
        answered: isAnswered(snap.type, ans),
      });
      if (current.mode === "PRACTICE" && isAnswered(snap.type, ans)) {
        const scored = scoreQuestion({
          type: snap.type,
          points: snap.points,
          scoringMode: snap.scoringMode,
          requiredAnswers: snap.requiredAnswers,
          payload: snap.payload,
          answer: ans,
        });
        feedback[row.question_id] = {
          correct: scored.isCorrect,
          explanation: snap.explanation,
          correctAnswer: formatCorrectAnswer(snap.type, snap.payload),
        };
      }
    }

    return {
      attempt: mapAttempt(current, attempt.title),
      remainingSeconds: remainingSeconds(current.expires_at),
      allowBack: Boolean(attempt.allow_back_navigation),
      questions,
      answers: Object.fromEntries(answers.map((a) => [a.question_id, parseJson(a.answer, null)])),
      navigator,
      feedback: current.mode === "PRACTICE" ? feedback : {},
    };
  });

export const saveAnswer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      attemptId: z.string(),
      questionId: z.string(),
      answer: answerSchema.nullable(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [data.attemptId]);
    const attempt = rows[0];
    if (!attempt || attempt.user_id !== context.userId) throw new AppError("Attempt not found", 404);
    const current = await expireIfNeeded(attempt);
    if (current.status !== "IN_PROGRESS") throw new AppError("This attempt is locked");
    const aq = await sql.query<{ snapshot: QuestionRecord | string }>(
      `select snapshot from attempt_questions where attempt_id = $1 and question_id = $2`,
      [data.attemptId, data.questionId],
    );
    if (!aq[0]) throw new AppError("Question not in this attempt");
    await sql.query(
      `insert into attempt_answers (id, attempt_id, question_id, answer, saved_at)
       values ($1,$2,$3,$4::jsonb, now())
       on conflict (attempt_id, question_id) do update set answer = $4::jsonb, saved_at = now()`,
      [nid("ans"), data.attemptId, data.questionId, jsonText(data.answer ?? {})],
    );
    if (current.mode !== "PRACTICE") {
      return { saved: true as const, remainingSeconds: remainingSeconds(current.expires_at) };
    }
    const snap = parseJson<QuestionRecord>(aq[0].snapshot, null as unknown as QuestionRecord);
    const scored = scoreQuestion({
      type: snap.type,
      points: snap.points,
      scoringMode: snap.scoringMode,
      requiredAnswers: snap.requiredAnswers,
      payload: snap.payload,
      answer: data.answer,
    });
    return {
      saved: true as const,
      remainingSeconds: remainingSeconds(current.expires_at),
      feedback: isAnswered(snap.type, data.answer)
        ? {
            correct: scored.isCorrect,
            explanation: snap.explanation,
            correctAnswer: formatCorrectAnswer(snap.type, snap.payload),
          }
        : null,
    };
  });

export const markQuestion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ attemptId: z.string(), questionId: z.string(), marked: z.boolean() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [data.attemptId]);
    if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
    if (rows[0].status !== "IN_PROGRESS") throw new AppError("This attempt is locked");
    await sql.query(
      `update attempt_questions set marked = $3 where attempt_id = $1 and question_id = $2`,
      [data.attemptId, data.questionId, data.marked],
    );
    return { ok: true };
  });

export const submitAttempt = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ attemptId: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [data.attemptId]);
    if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
    const current = await expireIfNeeded(rows[0]);
    if (current.status === "SUBMITTED" || current.status === "EXPIRED") return mapAttempt(current);
    return finalizeAttempt(current.id, "SUBMITTED");
  });

export const heartbeatAttempt = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ attemptId: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<AttemptRow>(`select * from quiz_attempts where id = $1`, [data.attemptId]);
    if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
    const current = await expireIfNeeded(rows[0]);
    return {
      status: current.status,
      remainingSeconds: remainingSeconds(current.expires_at),
    };
  });

export const getAttemptResult = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ attemptId: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<AttemptRow & { title: string }>(
      `select a.*, q.title from quiz_attempts a join quizzes q on q.id = a.quiz_id where a.id = $1`,
      [data.attemptId],
    );
    if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
    const current = await expireIfNeeded(rows[0]);
    if (current.status === "IN_PROGRESS") throw new AppError("Attempt is still in progress");

    const aq = await sql.query<{
      question_id: string;
      position: number;
      snapshot: QuestionRecord | string;
      option_order: Record<string, string[]> | string;
    }>(`select question_id, position, snapshot, option_order from attempt_questions where attempt_id = $1 order by position`, [
      current.id,
    ]);
    const answers = await sql.query<{
      question_id: string;
      answer: AnswerValue | string;
      is_correct: boolean | null;
      points_awarded: string | number | null;
    }>(`select question_id, answer, is_correct, points_awarded from attempt_answers where attempt_id = $1`, [
      current.id,
    ]);
    const answerMap = new Map(answers.map((a) => [a.question_id, a]));

    const review = aq.map((row) => {
      const snap = parseJson<QuestionRecord>(row.snapshot, null as unknown as QuestionRecord);
      const ans = parseJson<AnswerValue | null>(answerMap.get(row.question_id)?.answer ?? null, null);
      const scored = scoreQuestion({
        type: snap.type,
        points: snap.points,
        scoringMode: snap.scoringMode,
        requiredAnswers: snap.requiredAnswers,
        payload: snap.payload,
        answer: ans,
      });
      return {
        position: row.position + 1,
        question: snap,
        exam: applyOrder(snap, parseJson(row.option_order, {})),
        answer: ans,
        isCorrect: scored.isCorrect,
        unanswered: !isAnswered(snap.type, ans),
        pointsAwarded: scored.pointsAwarded,
        userAnswerLabel: formatAnswer(snap.type, snap.payload, ans),
        correctAnswerLabel: formatCorrectAnswer(snap.type, snap.payload),
      };
    });

    return { attempt: mapAttempt(current, rows[0].title), review };
  });

export const listMyAttempts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    const sql = await getSql();
    const rows = await sql.query<AttemptRow & { title: string }>(
      `select a.*, q.title from quiz_attempts a join quizzes q on q.id = a.quiz_id
       where a.user_id = $1 order by a.started_at desc`,
      [context.userId],
    );
    return rows.map((r) => mapAttempt(r, r.title));
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    await ensureProfile(context.userId, null, null);
    const sql = await getSql();
    const stats = await sql.query<{
      quizzes_taken: number;
      attempts: number;
      avg_score: string | number | null;
      best_score: string | number | null;
      pass_rate: string | number | null;
    }>(
      `select
        count(distinct quiz_id)::int as quizzes_taken,
        count(*)::int as attempts,
        avg(percentage) as avg_score,
        max(percentage) as best_score,
        avg(case when passed then 1.0 else 0.0 end) as pass_rate
       from quiz_attempts
       where user_id = $1 and status in ('SUBMITTED','EXPIRED')`,
      [context.userId],
    );
    const recent = await sql.query<AttemptRow & { title: string }>(
      `select a.*, q.title from quiz_attempts a join quizzes q on q.id = a.quiz_id
       where a.user_id = $1 order by a.started_at desc limit 8`,
      [context.userId],
    );
    const s = stats[0];
    return {
      quizzesTaken: s?.quizzes_taken ?? 0,
      attempts: s?.attempts ?? 0,
      averageScore: s?.avg_score == null ? null : Number(s.avg_score),
      bestScore: s?.best_score == null ? null : Number(s.best_score),
      passRate: s?.pass_rate == null ? null : Number(s.pass_rate),
      recent: recent.map((r) => mapAttempt(r, r.title)),
    };
  });

export const getMyQuizProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ quizId: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const open = await sql.query<AttemptRow>(
      `select * from quiz_attempts where user_id = $1 and quiz_id = $2 and status = 'IN_PROGRESS' order by started_at desc limit 1`,
      [context.userId, data.quizId],
    );
    let inProgress = open[0] ? await expireIfNeeded(open[0]) : null;
    if (inProgress && inProgress.status !== "IN_PROGRESS") inProgress = null;
    const done = await sql.query<{ n: number }>(
      `select count(*)::int as n from quiz_attempts where user_id = $1 and quiz_id = $2 and status in ('SUBMITTED','EXPIRED')`,
      [context.userId, data.quizId],
    );
    const quiz = await sql.query<{ max_attempts: number | null; allow_retake: boolean }>(
      `select max_attempts, allow_retake from quizzes where id = $1`,
      [data.quizId],
    );
    const used = done[0]?.n ?? 0;
    const max = quiz[0]?.max_attempts ?? null;
    return {
      inProgressId: inProgress?.id ?? null,
      attemptsUsed: used,
      attemptsRemaining: max == null ? null : Math.max(0, max - used),
      canStart: Boolean(quiz[0]?.allow_retake || used === 0) && (max == null || used < max) && !inProgress,
    };
  });
