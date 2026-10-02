import { n as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CZxOMQ2J.mjs";
import { a as mulberry32, i as hashString, o as nid, s as shuffle } from "./utils-DtDPPULZ.mjs";
import { a as jsonText, c as requireActiveUser, i as ensureProfile, o as loadQuestions, r as createServerRpc, t as AppError } from "./helpers-VgSEk9M3.mjs";
import { t as authMiddleware } from "./middleware-CWZoMa8v.mjs";
import { t as ensureSeeded } from "./seed-0puB-6M7.mjs";
import { _n as object, bn as string, cn as _enum, dn as boolean, un as array, xn as union, yn as record } from "../_libs/@better-auth/core+[...].mjs";
import { a as stripAnswerKey, i as scoreQuestion, n as formatCorrectAnswer, r as isAnswered, t as formatAnswer } from "./scoring-jGSfDrnQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attempts-BJgvIwo2.js
var answerSchema = union([
	object({ optionId: string() }),
	object({ optionIds: array(string()) }),
	object({ pairs: record(string(), string()) }),
	object({ itemIds: array(string()) }),
	object({ blanks: record(string(), string()) })
]);
function parseJson(value, fallback) {
	if (value == null) return fallback;
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
	return value;
}
function mapAttempt(row, title = row.title ?? "") {
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
		unansweredCount: row.unanswered_count
	};
}
function remainingSeconds(expiresAt) {
	return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1e3));
}
function applyOrder(question, order) {
	const stripped = stripAnswerKey(question.type, question.payload);
	const exam = {
		id: question.id,
		type: question.type,
		stem: question.stem,
		instruction: question.instruction,
		points: question.points,
		requiredAnswers: question.requiredAnswers,
		...stripped
	};
	if (exam.options && order.optionIds?.length) {
		const map = new Map(exam.options.map((o) => [o.id, o]));
		exam.options = order.optionIds.map((id) => map.get(id)).filter(Boolean);
	}
	if (exam.sources && order.sourceIds?.length) {
		const map = new Map(exam.sources.map((o) => [o.id, o]));
		exam.sources = order.sourceIds.map((id) => map.get(id)).filter(Boolean);
	}
	if (exam.targets && order.targetIds?.length) {
		const map = new Map(exam.targets.map((o) => [o.id, o]));
		exam.targets = order.targetIds.map((id) => map.get(id)).filter(Boolean);
	}
	if (exam.orderItems && order.itemIds?.length) {
		const map = new Map(exam.orderItems.map((o) => [o.id, o]));
		exam.orderItems = order.itemIds.map((id) => map.get(id)).filter(Boolean);
	}
	if (exam.blanks && order.blankIds?.length) {
		const map = new Map(exam.blanks.map((o) => [o.id, o]));
		exam.blanks = order.blankIds.map((id) => map.get(id)).filter(Boolean);
	}
	return exam;
}
function buildOrder(question, rng, randomize) {
	const p = question.payload;
	const order = {};
	if (p.options) order.optionIds = randomize ? shuffle(p.options.map((o) => o.id), rng) : p.options.map((o) => o.id);
	if (p.sources) order.sourceIds = randomize ? shuffle(p.sources.map((o) => o.id), rng) : p.sources.map((o) => o.id);
	if (p.targets) order.targetIds = randomize ? shuffle(p.targets.map((o) => o.id), rng) : p.targets.map((o) => o.id);
	if (p.orderItems) order.itemIds = randomize ? shuffle(p.orderItems.map((o) => o.id), rng) : p.orderItems.map((o) => o.id);
	if (p.blanks) order.blankIds = p.blanks.map((b) => b.id);
	return order;
}
async function finalizeAttempt(attemptId, status) {
	const sql = await getSql();
	const attempt = (await sql.query(`select * from quiz_attempts where id = $1`, [attemptId]))[0];
	if (!attempt) throw new AppError("Attempt not found", 404);
	if (attempt.status === "SUBMITTED" || attempt.status === "EXPIRED") return mapAttempt(attempt);
	const aq = await sql.query(`select question_id, snapshot from attempt_questions where attempt_id = $1`, [attemptId]);
	const answers = await sql.query(`select question_id, answer from attempt_answers where attempt_id = $1`, [attemptId]);
	const answerMap = new Map(answers.map((a) => [a.question_id, parseJson(a.answer, null)]));
	let score = 0;
	let maxScore = 0;
	let correct = 0;
	let incorrect = 0;
	let unanswered = 0;
	const passing = (await sql.query(`select passing_percentage from quizzes where id = $1`, [attempt.quiz_id]))[0]?.passing_percentage ?? 70;
	for (const row of aq) {
		const snap = parseJson(row.snapshot, null);
		if (!snap) continue;
		const payload = snap.payload;
		const ans = answerMap.get(row.question_id) ?? null;
		const result = scoreQuestion({
			type: snap.type,
			points: Number(snap.points),
			scoringMode: snap.scoringMode,
			requiredAnswers: snap.requiredAnswers,
			payload,
			answer: ans
		});
		maxScore += result.maxPoints;
		score += result.pointsAwarded;
		if (!isAnswered(snap.type, ans)) unanswered += 1;
		else if (result.isCorrect) correct += 1;
		else incorrect += 1;
		await sql.query(`insert into attempt_answers (id, attempt_id, question_id, answer, is_correct, points_awarded)
       values ($1,$2,$3,$4::jsonb,$5,$6)
       on conflict (attempt_id, question_id) do update set is_correct = $5, points_awarded = $6`, [
			nid("ans"),
			attemptId,
			row.question_id,
			jsonText(ans ?? {}),
			result.isCorrect,
			result.pointsAwarded
		]);
	}
	const percentage = maxScore > 0 ? Math.round(score / maxScore * 1e4) / 100 : 0;
	const started = new Date(attempt.started_at).getTime();
	const used = Math.max(1, Math.round((Date.now() - started) / 1e3));
	await sql.query(`update quiz_attempts set
      status = $2, submitted_at = now(), time_used_seconds = $3, score = $4, max_score = $5,
      percentage = $6, passed = $7, correct_count = $8, incorrect_count = $9, unanswered_count = $10, updated_at = now()
     where id = $1`, [
		attemptId,
		status,
		Math.min(used, attempt.duration_seconds),
		score,
		maxScore,
		percentage,
		percentage >= passing,
		correct,
		incorrect,
		unanswered
	]);
	return mapAttempt((await sql.query(`select * from quiz_attempts where id = $1`, [attemptId]))[0]);
}
async function expireIfNeeded(row) {
	if (row.status !== "IN_PROGRESS") return row;
	if (new Date(row.expires_at).getTime() > Date.now()) return row;
	await finalizeAttempt(row.id, "EXPIRED");
	return (await (await getSql()).query(`select * from quiz_attempts where id = $1`, [row.id]))[0];
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "9f3067a4e371e0c5b539c831c7df442b19e0703dde5948a5662f0d8d516ebc91",
	name: "getMyProfile",
	filename: "src/lib/server/attempts.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	await ensureSeeded();
	return ensureProfile(context.userId, null, null);
});
var startAttempt_createServerFn_handler = createServerRpc({
	id: "382890b1f549062d161ffe2f12bb26cac58f206309aaed302027293f1997cd35",
	name: "startAttempt",
	filename: "src/lib/server/attempts.ts"
}, (opts) => startAttempt.__executeServer(opts));
var startAttempt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	quizId: string(),
	mode: _enum(["PRACTICE", "EXAM"])
})).handler(startAttempt_createServerFn_handler, async ({ context, data }) => {
	await ensureSeeded();
	await requireActiveUser(context.userId);
	const sql = await getSql();
	const quiz = (await sql.query(`select * from quizzes where id = $1`, [data.quizId]))[0];
	if (!quiz || !quiz.published || !quiz.active || quiz.archived) throw new AppError("Quiz not available", 404);
	const open = await sql.query(`select * from quiz_attempts where user_id = $1 and quiz_id = $2 and status = 'IN_PROGRESS' order by started_at desc limit 1`, [context.userId, data.quizId]);
	if (open[0]) {
		const current = await expireIfNeeded(open[0]);
		if (current.status === "IN_PROGRESS") return {
			attemptId: current.id,
			resumed: true
		};
	}
	const used = (await sql.query(`select count(*)::int as n from quiz_attempts where user_id = $1 and quiz_id = $2 and status in ('SUBMITTED','EXPIRED')`, [context.userId, data.quizId]))[0]?.n ?? 0;
	if (!quiz.allow_retake && used > 0) throw new AppError("Retakes are not allowed for this quiz");
	if (quiz.max_attempts != null && used >= quiz.max_attempts) throw new AppError("No attempts remaining");
	const questions = await loadQuestions(quiz.id, true);
	if (questions.length === 0) throw new AppError("This quiz has no published questions");
	const rng = mulberry32(hashString(`${context.userId}:${Date.now()}:${quiz.id}`));
	const ordered = quiz.randomize_questions ? shuffle(questions, rng) : questions;
	const attemptId = nid("att");
	const duration = quiz.time_limit_seconds;
	await sql.query(`insert into quiz_attempts (
        id, user_id, quiz_id, attempt_number, mode, status, started_at, expires_at, duration_seconds, question_order
      ) values ($1,$2,$3,$4,$5,'IN_PROGRESS', now(), now() + ($6::text || ' seconds')::interval, $6, $7::jsonb)`, [
		attemptId,
		context.userId,
		quiz.id,
		used + 1,
		data.mode,
		duration,
		jsonText(ordered.map((q) => q.id))
	]);
	for (let i = 0; i < ordered.length; i += 1) {
		const q = ordered[i];
		const optionOrder = buildOrder(q, rng, quiz.randomize_options);
		await sql.query(`insert into attempt_questions (id, attempt_id, question_id, position, marked, option_order, snapshot)
         values ($1,$2,$3,$4,false,$5::jsonb,$6::jsonb)`, [
			nid("aq"),
			attemptId,
			q.id,
			i,
			jsonText(optionOrder),
			jsonText(q)
		]);
	}
	return {
		attemptId,
		resumed: false
	};
});
var getExamState_createServerFn_handler = createServerRpc({
	id: "84cd7385becc90b358ce1b698e30c794f3cf6430105e5772d9813ffc4f6290aa",
	name: "getExamState",
	filename: "src/lib/server/attempts.ts"
}, (opts) => getExamState.__executeServer(opts));
var getExamState = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(getExamState_createServerFn_handler, async ({ context, data }) => {
	await ensureSeeded();
	const sql = await getSql();
	const attempt = (await sql.query(`select a.*, q.title, q.allow_back_navigation
       from quiz_attempts a join quizzes q on q.id = a.quiz_id
       where a.id = $1`, [data.attemptId]))[0];
	if (!attempt || attempt.user_id !== context.userId) throw new AppError("Attempt not found", 404);
	const current = await expireIfNeeded(attempt);
	const aq = await sql.query(`select question_id, position, marked, option_order, snapshot from attempt_questions where attempt_id = $1 order by position`, [current.id]);
	const answers = await sql.query(`select question_id, answer from attempt_answers where attempt_id = $1`, [current.id]);
	const answerMap = new Map(answers.map((a) => [a.question_id, parseJson(a.answer, null)]));
	const questions = [];
	const navigator = [];
	const feedback = {};
	for (const row of aq) {
		const snap = parseJson(row.snapshot, null);
		const order = parseJson(row.option_order, {});
		if (!snap) continue;
		questions.push(applyOrder(snap, order));
		const ans = answerMap.get(row.question_id) ?? null;
		navigator.push({
			id: row.question_id,
			marked: Boolean(row.marked),
			answered: isAnswered(snap.type, ans)
		});
		if (current.mode === "PRACTICE" && isAnswered(snap.type, ans)) {
			const scored = scoreQuestion({
				type: snap.type,
				points: snap.points,
				scoringMode: snap.scoringMode,
				requiredAnswers: snap.requiredAnswers,
				payload: snap.payload,
				answer: ans
			});
			feedback[row.question_id] = {
				correct: scored.isCorrect,
				explanation: snap.explanation,
				correctAnswer: formatCorrectAnswer(snap.type, snap.payload)
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
		feedback: current.mode === "PRACTICE" ? feedback : {}
	};
});
var saveAnswer_createServerFn_handler = createServerRpc({
	id: "68886a29f24401c8ab0afacdb47dcffe75e7e1a25b09358856cd1d6c556f92f7",
	name: "saveAnswer",
	filename: "src/lib/server/attempts.ts"
}, (opts) => saveAnswer.__executeServer(opts));
var saveAnswer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	attemptId: string(),
	questionId: string(),
	answer: answerSchema.nullable()
})).handler(saveAnswer_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const attempt = (await sql.query(`select * from quiz_attempts where id = $1`, [data.attemptId]))[0];
	if (!attempt || attempt.user_id !== context.userId) throw new AppError("Attempt not found", 404);
	const current = await expireIfNeeded(attempt);
	if (current.status !== "IN_PROGRESS") throw new AppError("This attempt is locked");
	const aq = await sql.query(`select snapshot from attempt_questions where attempt_id = $1 and question_id = $2`, [data.attemptId, data.questionId]);
	if (!aq[0]) throw new AppError("Question not in this attempt");
	await sql.query(`insert into attempt_answers (id, attempt_id, question_id, answer, saved_at)
       values ($1,$2,$3,$4::jsonb, now())
       on conflict (attempt_id, question_id) do update set answer = $4::jsonb, saved_at = now()`, [
		nid("ans"),
		data.attemptId,
		data.questionId,
		jsonText(data.answer ?? {})
	]);
	if (current.mode !== "PRACTICE") return {
		saved: true,
		remainingSeconds: remainingSeconds(current.expires_at)
	};
	const snap = parseJson(aq[0].snapshot, null);
	const scored = scoreQuestion({
		type: snap.type,
		points: snap.points,
		scoringMode: snap.scoringMode,
		requiredAnswers: snap.requiredAnswers,
		payload: snap.payload,
		answer: data.answer
	});
	return {
		saved: true,
		remainingSeconds: remainingSeconds(current.expires_at),
		feedback: isAnswered(snap.type, data.answer) ? {
			correct: scored.isCorrect,
			explanation: snap.explanation,
			correctAnswer: formatCorrectAnswer(snap.type, snap.payload)
		} : null
	};
});
var markQuestion_createServerFn_handler = createServerRpc({
	id: "88c79977d75b92341928eeea3ffc3c8de69ff4705d0e29924b45aba8419ff3fb",
	name: "markQuestion",
	filename: "src/lib/server/attempts.ts"
}, (opts) => markQuestion.__executeServer(opts));
var markQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	attemptId: string(),
	questionId: string(),
	marked: boolean()
})).handler(markQuestion_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select * from quiz_attempts where id = $1`, [data.attemptId]);
	if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
	if (rows[0].status !== "IN_PROGRESS") throw new AppError("This attempt is locked");
	await sql.query(`update attempt_questions set marked = $3 where attempt_id = $1 and question_id = $2`, [
		data.attemptId,
		data.questionId,
		data.marked
	]);
	return { ok: true };
});
var submitAttempt_createServerFn_handler = createServerRpc({
	id: "6ae87ae7903c1a6ee5e45bc7e3f1d3cc28fcf8b80b99dac91dec4c1fd3590e76",
	name: "submitAttempt",
	filename: "src/lib/server/attempts.ts"
}, (opts) => submitAttempt.__executeServer(opts));
var submitAttempt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(submitAttempt_createServerFn_handler, async ({ context, data }) => {
	const rows = await (await getSql()).query(`select * from quiz_attempts where id = $1`, [data.attemptId]);
	if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
	const current = await expireIfNeeded(rows[0]);
	if (current.status === "SUBMITTED" || current.status === "EXPIRED") return mapAttempt(current);
	return finalizeAttempt(current.id, "SUBMITTED");
});
var heartbeatAttempt_createServerFn_handler = createServerRpc({
	id: "7935b2451894c355264a386af1d2392f65c19ca60efdedf60a5a6c3865cbe16a",
	name: "heartbeatAttempt",
	filename: "src/lib/server/attempts.ts"
}, (opts) => heartbeatAttempt.__executeServer(opts));
var heartbeatAttempt = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(heartbeatAttempt_createServerFn_handler, async ({ context, data }) => {
	const rows = await (await getSql()).query(`select * from quiz_attempts where id = $1`, [data.attemptId]);
	if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
	const current = await expireIfNeeded(rows[0]);
	return {
		status: current.status,
		remainingSeconds: remainingSeconds(current.expires_at)
	};
});
var getAttemptResult_createServerFn_handler = createServerRpc({
	id: "681b4a61b7af69e74c1f3cc4f64ee70585292949112454e52a2c06d7074ba16d",
	name: "getAttemptResult",
	filename: "src/lib/server/attempts.ts"
}, (opts) => getAttemptResult.__executeServer(opts));
var getAttemptResult = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(getAttemptResult_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select a.*, q.title from quiz_attempts a join quizzes q on q.id = a.quiz_id where a.id = $1`, [data.attemptId]);
	if (!rows[0] || rows[0].user_id !== context.userId) throw new AppError("Attempt not found", 404);
	const current = await expireIfNeeded(rows[0]);
	if (current.status === "IN_PROGRESS") throw new AppError("Attempt is still in progress");
	const aq = await sql.query(`select question_id, position, snapshot, option_order from attempt_questions where attempt_id = $1 order by position`, [current.id]);
	const answers = await sql.query(`select question_id, answer, is_correct, points_awarded from attempt_answers where attempt_id = $1`, [current.id]);
	const answerMap = new Map(answers.map((a) => [a.question_id, a]));
	const review = aq.map((row) => {
		const snap = parseJson(row.snapshot, null);
		const ans = parseJson(answerMap.get(row.question_id)?.answer ?? null, null);
		const scored = scoreQuestion({
			type: snap.type,
			points: snap.points,
			scoringMode: snap.scoringMode,
			requiredAnswers: snap.requiredAnswers,
			payload: snap.payload,
			answer: ans
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
			correctAnswerLabel: formatCorrectAnswer(snap.type, snap.payload)
		};
	});
	return {
		attempt: mapAttempt(current, rows[0].title),
		review
	};
});
var listMyAttempts_createServerFn_handler = createServerRpc({
	id: "1bec9611167beae43e28d5d09623a3459d322237299d59f52d9380f4501b93c9",
	name: "listMyAttempts",
	filename: "src/lib/server/attempts.ts"
}, (opts) => listMyAttempts.__executeServer(opts));
var listMyAttempts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyAttempts_createServerFn_handler, async ({ context }) => {
	await ensureSeeded();
	return (await (await getSql()).query(`select a.*, q.title from quiz_attempts a join quizzes q on q.id = a.quiz_id
       where a.user_id = $1 order by a.started_at desc`, [context.userId])).map((r) => mapAttempt(r, r.title));
});
var getDashboardStats_createServerFn_handler = createServerRpc({
	id: "9d53424e7f0b29f9e7894407a1b38c017c3226b80956af4e5db7cd1faf8a0a83",
	name: "getDashboardStats",
	filename: "src/lib/server/attempts.ts"
}, (opts) => getDashboardStats.__executeServer(opts));
var getDashboardStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboardStats_createServerFn_handler, async ({ context }) => {
	await ensureSeeded();
	await ensureProfile(context.userId, null, null);
	const sql = await getSql();
	const stats = await sql.query(`select
        count(distinct quiz_id)::int as quizzes_taken,
        count(*)::int as attempts,
        avg(percentage) as avg_score,
        max(percentage) as best_score,
        avg(case when passed then 1.0 else 0.0 end) as pass_rate
       from quiz_attempts
       where user_id = $1 and status in ('SUBMITTED','EXPIRED')`, [context.userId]);
	const recent = await sql.query(`select a.*, q.title from quiz_attempts a join quizzes q on q.id = a.quiz_id
       where a.user_id = $1 order by a.started_at desc limit 8`, [context.userId]);
	const s = stats[0];
	return {
		quizzesTaken: s?.quizzes_taken ?? 0,
		attempts: s?.attempts ?? 0,
		averageScore: s?.avg_score == null ? null : Number(s.avg_score),
		bestScore: s?.best_score == null ? null : Number(s.best_score),
		passRate: s?.pass_rate == null ? null : Number(s.pass_rate),
		recent: recent.map((r) => mapAttempt(r, r.title))
	};
});
var getMyQuizProgress_createServerFn_handler = createServerRpc({
	id: "205adfff2c3880e501d12db6c7e50b1d4b7cbe41b351fa07f11b4181b44c8e0f",
	name: "getMyQuizProgress",
	filename: "src/lib/server/attempts.ts"
}, (opts) => getMyQuizProgress.__executeServer(opts));
var getMyQuizProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ quizId: string() })).handler(getMyQuizProgress_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const open = await sql.query(`select * from quiz_attempts where user_id = $1 and quiz_id = $2 and status = 'IN_PROGRESS' order by started_at desc limit 1`, [context.userId, data.quizId]);
	let inProgress = open[0] ? await expireIfNeeded(open[0]) : null;
	if (inProgress && inProgress.status !== "IN_PROGRESS") inProgress = null;
	const done = await sql.query(`select count(*)::int as n from quiz_attempts where user_id = $1 and quiz_id = $2 and status in ('SUBMITTED','EXPIRED')`, [context.userId, data.quizId]);
	const quiz = await sql.query(`select max_attempts, allow_retake from quizzes where id = $1`, [data.quizId]);
	const used = done[0]?.n ?? 0;
	const max = quiz[0]?.max_attempts ?? null;
	return {
		inProgressId: inProgress?.id ?? null,
		attemptsUsed: used,
		attemptsRemaining: max == null ? null : Math.max(0, max - used),
		canStart: Boolean(quiz[0]?.allow_retake || used === 0) && (max == null || used < max) && !inProgress
	};
});
//#endregion
export { getAttemptResult_createServerFn_handler, getDashboardStats_createServerFn_handler, getExamState_createServerFn_handler, getMyProfile_createServerFn_handler, getMyQuizProgress_createServerFn_handler, heartbeatAttempt_createServerFn_handler, listMyAttempts_createServerFn_handler, markQuestion_createServerFn_handler, saveAnswer_createServerFn_handler, startAttempt_createServerFn_handler, submitAttempt_createServerFn_handler };
