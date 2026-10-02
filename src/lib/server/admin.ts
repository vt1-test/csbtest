import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { nid, slugify } from "@/lib/utils";
import { QUESTION_TYPES, type QuestionPayload, type QuestionType, type ScoringMode } from "@/lib/types";
import { AppError, audit, jsonText, mapQuestion, requireAdmin } from "./helpers";
import { ensureSeeded } from "./seed";

type AdminQuizListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  question_count: number;
  updated_at: string;
};

type AdminQuizRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  category: string;
  difficulty: string;
  time_limit_seconds: number;
  passing_percentage: number;
  feedback_mode: string;
  published: boolean;
  active: boolean;
  randomize_questions: boolean;
  randomize_options: boolean;
  allow_back_navigation: boolean;
  allow_retake: boolean;
  max_attempts: number | null;
};

type AdminUserRow = {
  user_id: string;
  full_name: string;
  role: string;
  status: string;
  created_at: string;
  last_login_at: string | null;
  email: string | null;
  attempt_count: number;
  avg_score: string | number | null;
};

type AdminResultRow = {
  id: string;
  user_name: string;
  email: string | null;
  quiz_title: string;
  attempt_number: number;
  score: string | number | null;
  percentage: string | number | null;
  passed: boolean | null;
  time_used_seconds: number | null;
  started_at: string;
  submitted_at: string | null;
  status: string;
};

type AuditRow = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
};

const quizInput = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().default(""),
  instructions: z.string().default(""),
  category: z.string().default("General"),
  difficulty: z.string().default("Intermediate"),
  timeLimitSeconds: z.number().int().positive(),
  passingPercentage: z.number().min(0).max(100),
  feedbackMode: z.enum(["PRACTICE", "EXAM"]),
  showExplanation: z.boolean().default(true),
  showScoreImmediately: z.boolean().default(true),
  randomizeQuestions: z.boolean().default(false),
  randomizeOptions: z.boolean().default(true),
  allowBackNavigation: z.boolean().default(true),
  allowRetake: z.boolean().default(true),
  maxAttempts: z.number().int().positive().nullable().optional(),
  matchingScoring: z.enum(["all_or_nothing", "proportional", "per_blank"]).default("all_or_nothing"),
  orderingScoring: z.enum(["all_or_nothing", "proportional", "per_blank"]).default("all_or_nothing"),
  dropdownScoring: z.enum(["all_or_nothing", "proportional", "per_blank"]).default("per_blank"),
  published: z.boolean().default(false),
  active: z.boolean().default(true),
});

const questionInput = z.object({
  id: z.string().optional(),
  quizId: z.string(),
  type: z.enum(QUESTION_TYPES),
  stem: z.string().min(1),
  instruction: z.string().default(""),
  explanation: z.string().default(""),
  difficulty: z.string().default("Medium"),
  points: z.number().positive().default(1),
  requiredAnswers: z.number().int().nullable().optional(),
  scoringMode: z.enum(["all_or_nothing", "proportional", "per_blank"]).default("all_or_nothing"),
  position: z.number().int().optional(),
  status: z.enum(["draft", "published"]).default("published"),
  sourceId: z.string().nullable().optional(),
  needsReview: z.boolean().default(false),
  reviewNote: z.string().nullable().optional(),
  payload: z.custom<QuestionPayload>(),
});

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    await requireAdmin(context.userId);
    const sql = await getSql();
    const users = await sql.query<{ n: number }>(`select count(*)::int as n from user_profiles`);
    const active = await sql.query<{ n: number }>(
      `select count(*)::int as n from user_profiles where status = 'ACTIVE'`,
    );
    const quizzes = await sql.query<{ n: number }>(`select count(*)::int as n from quizzes where archived = false`);
    const published = await sql.query<{ n: number }>(
      `select count(*)::int as n from quizzes where published = true and archived = false`,
    );
    const questions = await sql.query<{ n: number }>(`select count(*)::int as n from questions`);
    const attempts = await sql.query<{ n: number }>(
      `select count(*)::int as n from quiz_attempts where status in ('SUBMITTED','EXPIRED')`,
    );
    const scores = await sql.query<{ avg: string | number | null; pass: string | number | null }>(
      `select avg(percentage) as avg, avg(case when passed then 1.0 else 0.0 end) as pass
       from quiz_attempts where status in ('SUBMITTED','EXPIRED')`,
    );
    return {
      totalUsers: users[0]?.n ?? 0,
      activeUsers: active[0]?.n ?? 0,
      totalQuizzes: quizzes[0]?.n ?? 0,
      publishedQuizzes: published[0]?.n ?? 0,
      questions: questions[0]?.n ?? 0,
      attempts: attempts[0]?.n ?? 0,
      averageScore: scores[0]?.avg == null ? null : Number(scores[0].avg),
      passRate: scores[0]?.pass == null ? null : Number(scores[0].pass),
    };
  });

export const adminListQuizzes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      q: z.string().optional(),
      category: z.string().optional(),
      page: z.number().int().default(1),
      pageSize: z.number().int().default(20),
    }),
  )
  .handler(async ({ context, data }) => {
    await ensureSeeded();
    await requireAdmin(context.userId);
    const sql = await getSql();
    const where = [`archived = false`];
    const params: unknown[] = [];
    if (data.q) {
      params.push(`%${data.q}%`);
      where.push(`(title ilike $${params.length} or slug ilike $${params.length})`);
    }
    if (data.category) {
      params.push(data.category);
      where.push(`category = $${params.length}`);
    }
    const whereSql = where.length ? `where ${where.join(" and ")}` : "";
    const count = await sql.query<{ n: number }>(`select count(*)::int as n from quizzes ${whereSql}`, params);
    const offset = (data.page - 1) * data.pageSize;
    params.push(data.pageSize, offset);
    const rows = await sql.query<AdminQuizListItem>(
      `select q.id, q.title, q.slug, q.category, q.published, q.updated_at::text as updated_at,
              (select count(*)::int from questions qq where qq.quiz_id = q.id) as question_count
       from quizzes q ${whereSql} order by q.updated_at desc limit $${params.length - 1} offset $${params.length}`,
      params,
    );
    return { rows, total: count[0]?.n ?? 0 };
  });

export const adminGetQuiz = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<AdminQuizRow>(`select * from quizzes where id = $1`, [data.id]);
    if (!rows[0]) throw new AppError("Quiz not found", 404);
    const questions = await sql.query(`select * from questions where quiz_id = $1 order by position, id`, [data.id]);
    return { quiz: rows[0], questions: questions.map((q) => mapQuestion(q as Parameters<typeof mapQuestion>[0])) };
  });

export const adminSaveQuiz = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(quizInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const id = data.id ?? nid("quiz");
    const slug = (data.slug || slugify(data.title) || id).toLowerCase();
    const existing = await sql.query(`select id from quizzes where id = $1`, [id]);
    if (existing[0]) {
      await sql.query(
        `update quizzes set title=$2, slug=$3, description=$4, instructions=$5, category=$6, difficulty=$7,
         time_limit_seconds=$8, passing_percentage=$9, feedback_mode=$10, show_explanation=$11,
         show_score_immediately=$12, randomize_questions=$13, randomize_options=$14, allow_back_navigation=$15,
         allow_retake=$16, max_attempts=$17, matching_scoring=$18, ordering_scoring=$19, dropdown_scoring=$20,
         published=$21, active=$22, updated_at=now() where id=$1`,
        [
          id,
          data.title,
          slug,
          data.description,
          data.instructions,
          data.category,
          data.difficulty,
          data.timeLimitSeconds,
          data.passingPercentage,
          data.feedbackMode,
          data.showExplanation,
          data.showScoreImmediately,
          data.randomizeQuestions,
          data.randomizeOptions,
          data.allowBackNavigation,
          data.allowRetake,
          data.maxAttempts ?? null,
          data.matchingScoring,
          data.orderingScoring,
          data.dropdownScoring,
          data.published,
          data.active,
        ],
      );
      await audit(context.userId, "quiz.edited", "quiz", id);
    } else {
      await sql.query(
        `insert into quizzes (
          id, title, slug, description, instructions, category, difficulty, time_limit_seconds,
          passing_percentage, feedback_mode, show_explanation, show_score_immediately, randomize_questions,
          randomize_options, allow_back_navigation, allow_retake, max_attempts, matching_scoring,
          ordering_scoring, dropdown_scoring, published, active, created_by
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
        [
          id,
          data.title,
          slug,
          data.description,
          data.instructions,
          data.category,
          data.difficulty,
          data.timeLimitSeconds,
          data.passingPercentage,
          data.feedbackMode,
          data.showExplanation,
          data.showScoreImmediately,
          data.randomizeQuestions,
          data.randomizeOptions,
          data.allowBackNavigation,
          data.allowRetake,
          data.maxAttempts ?? null,
          data.matchingScoring,
          data.orderingScoring,
          data.dropdownScoring,
          data.published,
          data.active,
          context.userId,
        ],
      );
      await audit(context.userId, "quiz.created", "quiz", id);
    }
    return { id, slug };
  });

export const adminQuizAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), action: z.enum(["publish", "unpublish", "archive", "delete", "duplicate"]) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    if (data.action === "publish") {
      await sql.query(`update quizzes set published = true, updated_at = now() where id = $1`, [data.id]);
      await audit(context.userId, "quiz.published", "quiz", data.id);
    } else if (data.action === "unpublish") {
      await sql.query(`update quizzes set published = false, updated_at = now() where id = $1`, [data.id]);
      await audit(context.userId, "quiz.unpublished", "quiz", data.id);
    } else if (data.action === "archive") {
      await sql.query(`update quizzes set archived = true, published = false, updated_at = now() where id = $1`, [
        data.id,
      ]);
      await audit(context.userId, "quiz.archived", "quiz", data.id);
    } else if (data.action === "delete") {
      await sql.query(`delete from quizzes where id = $1`, [data.id]);
      await audit(context.userId, "quiz.deleted", "quiz", data.id);
    } else if (data.action === "duplicate") {
      const src = await sql.query<Record<string, unknown>>(`select * from quizzes where id = $1`, [data.id]);
      if (!src[0]) throw new AppError("Quiz not found", 404);
      const newId = nid("quiz");
      const slug = `${String(src[0].slug)}-copy-${newId.slice(-6)}`;
      await sql.query(
        `insert into quizzes (
          id, title, slug, description, instructions, category, difficulty, time_limit_seconds,
          passing_percentage, feedback_mode, show_explanation, show_score_immediately, randomize_questions,
          randomize_options, allow_back_navigation, allow_retake, max_attempts, matching_scoring,
          ordering_scoring, dropdown_scoring, published, active, created_by
        ) select $2, title || ' (copy)', $3, description, instructions, category, difficulty, time_limit_seconds,
          passing_percentage, feedback_mode, show_explanation, show_score_immediately, randomize_questions,
          randomize_options, allow_back_navigation, allow_retake, max_attempts, matching_scoring,
          ordering_scoring, dropdown_scoring, false, active, $4 from quizzes where id = $1`,
        [data.id, newId, slug, context.userId],
      );
      const qs = await sql.query<Record<string, unknown>>(`select * from questions where quiz_id = $1`, [data.id]);
      for (const q of qs) {
        const qid = nid("q");
        await sql.query(
          `insert into questions (
            id, quiz_id, type, stem, instruction, explanation, difficulty, points, required_answers,
            scoring_mode, position, status, source_id, needs_review, review_note, payload
          ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb)`,
          [
            qid,
            newId,
            q.type,
            q.stem,
            q.instruction,
            q.explanation,
            q.difficulty,
            q.points,
            q.required_answers,
            q.scoring_mode,
            q.position,
            q.status,
            q.source_id,
            q.needs_review,
            q.review_note,
            jsonText(q.payload),
          ],
        );
      }
      await audit(context.userId, "quiz.duplicated", "quiz", newId, { from: data.id });
      return { id: newId };
    }
    return { ok: true };
  });

export const adminListQuestions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      quizId: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
      q: z.string().optional(),
      page: z.number().int().default(1),
      pageSize: z.number().int().default(25),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const where: string[] = [];
    const params: unknown[] = [];
    if (data.quizId) {
      params.push(data.quizId);
      where.push(`qq.quiz_id = $${params.length}`);
    }
    if (data.type) {
      params.push(data.type);
      where.push(`qq.type = $${params.length}`);
    }
    if (data.status) {
      params.push(data.status);
      where.push(`qq.status = $${params.length}`);
    }
    if (data.q) {
      params.push(`%${data.q}%`);
      where.push(`qq.stem ilike $${params.length}`);
    }
    const whereSql = where.length ? `where ${where.join(" and ")}` : "";
    const count = await sql.query<{ n: number }>(`select count(*)::int as n from questions qq ${whereSql}`, params);
    const offset = (data.page - 1) * data.pageSize;
    params.push(data.pageSize, offset);
    const rows = await sql.query(
      `select qq.*, q.title as quiz_title from questions qq
       join quizzes q on q.id = qq.quiz_id ${whereSql}
       order by qq.updated_at desc limit $${params.length - 1} offset $${params.length}`,
      params,
    );
    return { rows: rows.map((r) => ({ ...mapQuestion(r as never), quizTitle: (r as { quiz_title: string }).quiz_title })), total: count[0]?.n ?? 0 };
  });

export const adminGetQuestion = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query(`select * from questions where id = $1`, [data.id]);
    if (!rows[0]) throw new AppError("Question not found", 404);
    return mapQuestion(rows[0] as never);
  });

export const adminSaveQuestion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(questionInput)
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const id = data.id ?? nid("q");
    const existing = await sql.query(`select id, position from questions where id = $1`, [id]);
    const pos =
      data.position ??
      (existing[0]
        ? (existing[0] as { position: number }).position
        : ((
            await sql.query<{ n: number }>(`select coalesce(max(position),0)::int as n from questions where quiz_id = $1`, [
              data.quizId,
            ])
          )[0]?.n ?? 0) + 1);
    if (existing[0]) {
      await sql.query(
        `insert into question_versions (id, question_id, version, snapshot)
         select $2, $1, coalesce(max(version),0)+1, to_jsonb(q) from questions q, question_versions
         where q.id = $1 group by q.id`,
        [id, nid("qv")],
      ).catch(async () => {
        const snap = await sql.query(`select * from questions where id = $1`, [id]);
        await sql.query(
          `insert into question_versions (id, question_id, version, snapshot) values ($1,$2,1,$3::jsonb)`,
          [nid("qv"), id, jsonText(snap[0])],
        );
      });
      await sql.query(
        `update questions set quiz_id=$2, type=$3, stem=$4, instruction=$5, explanation=$6, difficulty=$7,
         points=$8, required_answers=$9, scoring_mode=$10, position=$11, status=$12, source_id=$13,
         needs_review=$14, review_note=$15, payload=$16::jsonb, updated_at=now() where id=$1`,
        [
          id,
          data.quizId,
          data.type,
          data.stem,
          data.instruction,
          data.explanation,
          data.difficulty,
          data.points,
          data.requiredAnswers ?? null,
          data.scoringMode,
          pos,
          data.status,
          data.sourceId ?? null,
          data.needsReview,
          data.reviewNote ?? null,
          jsonText(data.payload),
        ],
      );
      await audit(context.userId, "question.edited", "question", id);
    } else {
      await sql.query(
        `insert into questions (
          id, quiz_id, type, stem, instruction, explanation, difficulty, points, required_answers,
          scoring_mode, position, status, source_id, needs_review, review_note, payload
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb)`,
        [
          id,
          data.quizId,
          data.type,
          data.stem,
          data.instruction,
          data.explanation,
          data.difficulty,
          data.points,
          data.requiredAnswers ?? null,
          data.scoringMode,
          pos,
          data.status,
          data.sourceId ?? null,
          data.needsReview,
          data.reviewNote ?? null,
          jsonText(data.payload),
        ],
      );
      await audit(context.userId, "question.created", "question", id);
    }
    return { id };
  });

export const adminDeleteQuestion = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql.query(`delete from questions where id = $1`, [data.id]);
    await audit(context.userId, "question.deleted", "question", data.id);
    return { ok: true };
  });

export const adminReorderQuestions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ quizId: z.string(), orderedIds: z.array(z.string()) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    for (let i = 0; i < data.orderedIds.length; i += 1) {
      await sql.query(`update questions set position = $2 where id = $1 and quiz_id = $3`, [
        data.orderedIds[i],
        i + 1,
        data.quizId,
      ]);
    }
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql.query<AdminUserRow>(
      `select p.user_id, p.full_name, p.role, p.status, p.created_at::text as created_at,
              p.last_login_at::text as last_login_at,
              u.email,
              (select count(*)::int from quiz_attempts a where a.user_id = p.user_id) as attempt_count,
              (select avg(percentage) from quiz_attempts a where a.user_id = p.user_id and a.status in ('SUBMITTED','EXPIRED')) as avg_score
       from user_profiles p
       left join "user" u on u.id = p.user_id
       order by p.created_at desc`,
    );
  });

export const adminUpdateUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string(),
      role: z.enum(["USER", "ADMIN"]).optional(),
      status: z.enum(["ACTIVE", "DEACTIVATED"]).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (data.userId === context.userId && data.role === "USER") {
      throw new AppError("You cannot demote yourself");
    }
    const sql = await getSql();
    if (data.role) {
      await sql.query(`update user_profiles set role = $2, updated_at = now() where user_id = $1`, [
        data.userId,
        data.role,
      ]);
      await audit(context.userId, "user.role_changed", "user", data.userId, { role: data.role });
    }
    if (data.status) {
      await sql.query(`update user_profiles set status = $2, updated_at = now() where user_id = $1`, [
        data.userId,
        data.status,
      ]);
      await audit(context.userId, data.status === "ACTIVE" ? "user.activated" : "user.deactivated", "user", data.userId);
    }
    return { ok: true };
  });

export const adminListResults = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      quizId: z.string().optional(),
      passed: z.boolean().optional(),
      page: z.number().int().default(1),
      pageSize: z.number().int().default(30),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const where = [`a.status in ('SUBMITTED','EXPIRED')`];
    const params: unknown[] = [];
    if (data.quizId) {
      params.push(data.quizId);
      where.push(`a.quiz_id = $${params.length}`);
    }
    if (data.passed === true) where.push(`a.passed = true`);
    if (data.passed === false) where.push(`a.passed = false`);
    const whereSql = `where ${where.join(" and ")}`;
    const count = await sql.query<{ n: number }>(`select count(*)::int as n from quiz_attempts a ${whereSql}`, params);
    const offset = (data.page - 1) * data.pageSize;
    params.push(data.pageSize, offset);
    const rows = await sql.query<AdminResultRow>(
      `select a.id, coalesce(p.full_name, u.email, a.user_id) as user_name, u.email,
              q.title as quiz_title, a.attempt_number, a.score, a.percentage, a.passed,
              a.time_used_seconds, a.started_at::text as started_at, a.submitted_at::text as submitted_at, a.status
       from quiz_attempts a
       join quizzes q on q.id = a.quiz_id
       left join user_profiles p on p.user_id = a.user_id
       left join "user" u on u.id = a.user_id
       ${whereSql} order by a.submitted_at desc nulls last
       limit $${params.length - 1} offset $${params.length}`,
      params,
    );
    return { rows, total: count[0]?.n ?? 0 };
  });

export const adminExportResultsCsv = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql.query<Record<string, string | number | boolean | null>>(
      `select a.id, coalesce(p.full_name,'') as user_name, u.email, q.title as quiz, a.attempt_number,
              a.score, a.max_score, a.percentage, a.passed, a.correct_count, a.incorrect_count,
              a.unanswered_count, a.time_used_seconds, a.started_at::text as started_at, a.submitted_at::text as submitted_at, a.status
       from quiz_attempts a
       join quizzes q on q.id = a.quiz_id
       left join user_profiles p on p.user_id = a.user_id
       left join "user" u on u.id = a.user_id
       where a.status in ('SUBMITTED','EXPIRED')
       order by a.submitted_at desc`,
    );
    const headers = [
      "id",
      "user_name",
      "email",
      "quiz",
      "attempt_number",
      "score",
      "max_score",
      "percentage",
      "passed",
      "correct_count",
      "incorrect_count",
      "unanswered_count",
      "time_used_seconds",
      "started_at",
      "submitted_at",
      "status",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = r[h];
            const s = v == null ? "" : String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(","),
      ),
    ].join("\n");
    return { csv };
  });

export const adminExportQuestionsJson = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ quizId: z.string().optional() }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const params: unknown[] = [];
    let where = "";
    if (data.quizId) {
      params.push(data.quizId);
      where = "where quiz_id = $1";
    }
    const rows = await sql.query(`select * from questions ${where} order by quiz_id, position`, params);
    return { questions: rows.map((r) => mapQuestion(r as never)) };
  });

export const adminAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    await requireAdmin(context.userId);
    const sql = await getSql();
    const overview = await sql.query<{
      attempts: number;
      users: number;
      avg: string | number | null;
      pass: string | number | null;
      avg_time: string | number | null;
    }>(
      `select count(*)::int as attempts,
              count(distinct user_id)::int as users,
              avg(percentage) as avg,
              avg(case when passed then 1.0 else 0.0 end) as pass,
              avg(time_used_seconds) as avg_time
       from quiz_attempts where status in ('SUBMITTED','EXPIRED')`,
    );
    const byDay = await sql.query<{ day: string; n: number; avg: string | number | null }>(
      `select to_char(date_trunc('day', submitted_at), 'YYYY-MM-DD') as day,
              count(*)::int as n, avg(percentage) as avg
       from quiz_attempts
       where status in ('SUBMITTED','EXPIRED') and submitted_at is not null
       group by 1 order by 1`,
    );
    const passFail = await sql.query<{ passed: boolean; n: number }>(
      `select passed, count(*)::int as n from quiz_attempts
       where status in ('SUBMITTED','EXPIRED') group by passed`,
    );
    const byType = await sql.query<{ type: QuestionType; attempts: number; correct: number }>(
      `select (aq.snapshot->>'type') as type,
              count(*)::int as attempts,
              sum(case when aa.is_correct then 1 else 0 end)::int as correct
       from attempt_answers aa
       join attempt_questions aq on aq.attempt_id = aa.attempt_id and aq.question_id = aa.question_id
       join quiz_attempts a on a.id = aa.attempt_id
       where a.status in ('SUBMITTED','EXPIRED')
       group by 1 order by 1`,
    );
    const missed = await sql.query<{
      question_id: string;
      stem: string;
      attempts: number;
      correct: number;
    }>(
      `select aa.question_id,
              coalesce(q.stem, aq.snapshot->>'stem') as stem,
              count(*)::int as attempts,
              sum(case when aa.is_correct then 1 else 0 end)::int as correct
       from attempt_answers aa
       join quiz_attempts a on a.id = aa.attempt_id
       left join questions q on q.id = aa.question_id
       join attempt_questions aq on aq.attempt_id = aa.attempt_id and aq.question_id = aa.question_id
       where a.status in ('SUBMITTED','EXPIRED')
       group by 1, 2
       order by (sum(case when aa.is_correct then 1 else 0 end)::float / nullif(count(*),0)) asc
       limit 12`,
    );
    const o = overview[0];
    const scores = await sql.query<{ percentage: string | number }>(
      `select percentage from quiz_attempts where status in ('SUBMITTED','EXPIRED') and percentage is not null order by percentage`,
    );
    const nums = scores.map((s) => Number(s.percentage));
    const median =
      nums.length === 0 ? null : nums.length % 2 ? nums[(nums.length - 1) / 2] : (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2;
    return {
      attempts: o?.attempts ?? 0,
      uniqueUsers: o?.users ?? 0,
      averageScore: o?.avg == null ? null : Number(o.avg),
      medianScore: median,
      passRate: o?.pass == null ? null : Number(o.pass),
      averageTime: o?.avg_time == null ? null : Number(o.avg_time),
      byDay: byDay.map((d) => ({ day: d.day, attempts: d.n, average: d.avg == null ? 0 : Number(d.avg) })),
      passFail,
      byType: byType.map((t) => ({
        type: t.type,
        attempts: t.attempts,
        correct: t.correct,
        success: t.attempts ? t.correct / t.attempts : 0,
      })),
      missed: missed.map((m) => ({
        id: m.question_id,
        stem: m.stem,
        attempts: m.attempts,
        correct: m.correct,
        success: m.attempts ? m.correct / m.attempts : 0,
      })),
    };
  });

export const adminAuditLog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    return sql.query<AuditRow>(
      `select id, actor_id, action, entity_type, entity_id, created_at::text as created_at
       from audit_logs order by created_at desc limit 200`,
    );
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const users = await sql.query<{ id: string; email: string }>(
      `select id, email from "user" where lower(email) = lower($1)`,
      [data.email],
    );
    const generic = { ok: true as const, resetPath: null as string | null };
    if (!users[0]) return generic;
    const token = nid("rst").replace(/-/g, "");
    const { hashPassword } = await import("better-auth/crypto");
    const tokenHash = await hashPassword(token);
    await sql.query(
      `insert into password_reset_tokens (id, user_id, email, token_hash, expires_at)
       values ($1,$2,$3,$4, now() + interval '1 hour')`,
      [nid("prt"), users[0].id, users[0].email, tokenHash],
    );
    return { ok: true as const, resetPath: `/reset-password?token=${token}` };
  });

export const completePasswordReset = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), password: z.string().min(8) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query<{ id: string; user_id: string; token_hash: string }>(
      `select id, user_id, token_hash from password_reset_tokens
       where used_at is null and expires_at > now() order by expires_at desc`,
    );
    const { verifyPassword, hashPassword } = await import("better-auth/crypto");
    let match: (typeof rows)[number] | null = null;
    for (const row of rows) {
      const ok = await verifyPassword({ hash: row.token_hash, password: data.token });
      if (ok) {
        match = row;
        break;
      }
    }
    if (!match) throw new AppError("Invalid or expired reset link");
    const passwordHash = await hashPassword(data.password);
    await sql.query(
      `update account set password = $2, "updatedAt" = now()
       where "userId" = $1 and "providerId" = 'credential'`,
      [match.user_id, passwordHash],
    );
    await sql.query(`update password_reset_tokens set used_at = now() where id = $1`, [match.id]);
    return { ok: true };
  });
