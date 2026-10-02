import { n as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CZxOMQ2J.mjs";
import { c as slugify, o as nid } from "./utils-DtDPPULZ.mjs";
import { a as jsonText, l as requireAdmin, n as audit, r as createServerRpc, s as mapQuestion, t as AppError } from "./helpers-VgSEk9M3.mjs";
import { t as authMiddleware } from "./middleware-CWZoMa8v.mjs";
import { t as QUESTION_TYPES } from "./types-CfSM8BPy.mjs";
import { t as ensureSeeded } from "./seed-0puB-6M7.mjs";
import { _n as object, bn as string, cn as _enum, dn as boolean, fn as custom, gn as number, un as array } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BGwC3Nnt.js
var quizInput = object({
	id: string().optional(),
	title: string().min(1),
	slug: string().optional(),
	description: string().default(""),
	instructions: string().default(""),
	category: string().default("General"),
	difficulty: string().default("Intermediate"),
	timeLimitSeconds: number().int().positive(),
	passingPercentage: number().min(0).max(100),
	feedbackMode: _enum(["PRACTICE", "EXAM"]),
	showExplanation: boolean().default(true),
	showScoreImmediately: boolean().default(true),
	randomizeQuestions: boolean().default(false),
	randomizeOptions: boolean().default(true),
	allowBackNavigation: boolean().default(true),
	allowRetake: boolean().default(true),
	maxAttempts: number().int().positive().nullable().optional(),
	matchingScoring: _enum([
		"all_or_nothing",
		"proportional",
		"per_blank"
	]).default("all_or_nothing"),
	orderingScoring: _enum([
		"all_or_nothing",
		"proportional",
		"per_blank"
	]).default("all_or_nothing"),
	dropdownScoring: _enum([
		"all_or_nothing",
		"proportional",
		"per_blank"
	]).default("per_blank"),
	published: boolean().default(false),
	active: boolean().default(true)
});
var questionInput = object({
	id: string().optional(),
	quizId: string(),
	type: _enum(QUESTION_TYPES),
	stem: string().min(1),
	instruction: string().default(""),
	explanation: string().default(""),
	difficulty: string().default("Medium"),
	points: number().positive().default(1),
	requiredAnswers: number().int().nullable().optional(),
	scoringMode: _enum([
		"all_or_nothing",
		"proportional",
		"per_blank"
	]).default("all_or_nothing"),
	position: number().int().optional(),
	status: _enum(["draft", "published"]).default("published"),
	sourceId: string().nullable().optional(),
	needsReview: boolean().default(false),
	reviewNote: string().nullable().optional(),
	payload: custom()
});
var adminOverview_createServerFn_handler = createServerRpc({
	id: "b0810fbd9f9f0856d1b14e3fa48305c27383e99a16fd93e99113c7c1e713f6ee",
	name: "adminOverview",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminOverview.__executeServer(opts));
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminOverview_createServerFn_handler, async ({ context }) => {
	await ensureSeeded();
	await requireAdmin(context.userId);
	const sql = await getSql();
	const users = await sql.query(`select count(*)::int as n from user_profiles`);
	const active = await sql.query(`select count(*)::int as n from user_profiles where status = 'ACTIVE'`);
	const quizzes = await sql.query(`select count(*)::int as n from quizzes where archived = false`);
	const published = await sql.query(`select count(*)::int as n from quizzes where published = true and archived = false`);
	const questions = await sql.query(`select count(*)::int as n from questions`);
	const attempts = await sql.query(`select count(*)::int as n from quiz_attempts where status in ('SUBMITTED','EXPIRED')`);
	const scores = await sql.query(`select avg(percentage) as avg, avg(case when passed then 1.0 else 0.0 end) as pass
       from quiz_attempts where status in ('SUBMITTED','EXPIRED')`);
	return {
		totalUsers: users[0]?.n ?? 0,
		activeUsers: active[0]?.n ?? 0,
		totalQuizzes: quizzes[0]?.n ?? 0,
		publishedQuizzes: published[0]?.n ?? 0,
		questions: questions[0]?.n ?? 0,
		attempts: attempts[0]?.n ?? 0,
		averageScore: scores[0]?.avg == null ? null : Number(scores[0].avg),
		passRate: scores[0]?.pass == null ? null : Number(scores[0].pass)
	};
});
var adminListQuizzes_createServerFn_handler = createServerRpc({
	id: "8ba26361e30490465ac8d7388877fa99a961960ecce4b78fc9e3291441b79b7b",
	name: "adminListQuizzes",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListQuizzes.__executeServer(opts));
var adminListQuizzes = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	q: string().optional(),
	category: string().optional(),
	page: number().int().default(1),
	pageSize: number().int().default(20)
})).handler(adminListQuizzes_createServerFn_handler, async ({ context, data }) => {
	await ensureSeeded();
	await requireAdmin(context.userId);
	const sql = await getSql();
	const where = [`archived = false`];
	const params = [];
	if (data.q) {
		params.push(`%${data.q}%`);
		where.push(`(title ilike $${params.length} or slug ilike $${params.length})`);
	}
	if (data.category) {
		params.push(data.category);
		where.push(`category = $${params.length}`);
	}
	const whereSql = where.length ? `where ${where.join(" and ")}` : "";
	const count = await sql.query(`select count(*)::int as n from quizzes ${whereSql}`, params);
	const offset = (data.page - 1) * data.pageSize;
	params.push(data.pageSize, offset);
	return {
		rows: await sql.query(`select q.id, q.title, q.slug, q.category, q.published, q.updated_at::text as updated_at,
              (select count(*)::int from questions qq where qq.quiz_id = q.id) as question_count
       from quizzes q ${whereSql} order by q.updated_at desc limit $${params.length - 1} offset $${params.length}`, params),
		total: count[0]?.n ?? 0
	};
});
var adminGetQuiz_createServerFn_handler = createServerRpc({
	id: "691a0dd8e211f7576a7351ac548afe8c8e4056c09f6a8ac5fca68ec90c624d99",
	name: "adminGetQuiz",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminGetQuiz.__executeServer(opts));
var adminGetQuiz = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(adminGetQuiz_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const rows = await sql.query(`select * from quizzes where id = $1`, [data.id]);
	if (!rows[0]) throw new AppError("Quiz not found", 404);
	const questions = await sql.query(`select * from questions where quiz_id = $1 order by position, id`, [data.id]);
	return {
		quiz: rows[0],
		questions: questions.map((q) => mapQuestion(q))
	};
});
var adminSaveQuiz_createServerFn_handler = createServerRpc({
	id: "84232cf61fa92bceb1336a05e72c880101c35d75316cd679bbfca5f20aad037c",
	name: "adminSaveQuiz",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveQuiz.__executeServer(opts));
var adminSaveQuiz = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(quizInput).handler(adminSaveQuiz_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const id = data.id ?? nid("quiz");
	const slug = (data.slug || slugify(data.title) || id).toLowerCase();
	if ((await sql.query(`select id from quizzes where id = $1`, [id]))[0]) {
		await sql.query(`update quizzes set title=$2, slug=$3, description=$4, instructions=$5, category=$6, difficulty=$7,
         time_limit_seconds=$8, passing_percentage=$9, feedback_mode=$10, show_explanation=$11,
         show_score_immediately=$12, randomize_questions=$13, randomize_options=$14, allow_back_navigation=$15,
         allow_retake=$16, max_attempts=$17, matching_scoring=$18, ordering_scoring=$19, dropdown_scoring=$20,
         published=$21, active=$22, updated_at=now() where id=$1`, [
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
			data.active
		]);
		await audit(context.userId, "quiz.edited", "quiz", id);
	} else {
		await sql.query(`insert into quizzes (
          id, title, slug, description, instructions, category, difficulty, time_limit_seconds,
          passing_percentage, feedback_mode, show_explanation, show_score_immediately, randomize_questions,
          randomize_options, allow_back_navigation, allow_retake, max_attempts, matching_scoring,
          ordering_scoring, dropdown_scoring, published, active, created_by
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`, [
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
			context.userId
		]);
		await audit(context.userId, "quiz.created", "quiz", id);
	}
	return {
		id,
		slug
	};
});
var adminQuizAction_createServerFn_handler = createServerRpc({
	id: "7d4ae05742af54729e7396225142aaac3205f2a180acdefc8ba82bb0a1882d66",
	name: "adminQuizAction",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminQuizAction.__executeServer(opts));
var adminQuizAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	action: _enum([
		"publish",
		"unpublish",
		"archive",
		"delete",
		"duplicate"
	])
})).handler(adminQuizAction_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	if (data.action === "publish") {
		await sql.query(`update quizzes set published = true, updated_at = now() where id = $1`, [data.id]);
		await audit(context.userId, "quiz.published", "quiz", data.id);
	} else if (data.action === "unpublish") {
		await sql.query(`update quizzes set published = false, updated_at = now() where id = $1`, [data.id]);
		await audit(context.userId, "quiz.unpublished", "quiz", data.id);
	} else if (data.action === "archive") {
		await sql.query(`update quizzes set archived = true, published = false, updated_at = now() where id = $1`, [data.id]);
		await audit(context.userId, "quiz.archived", "quiz", data.id);
	} else if (data.action === "delete") {
		await sql.query(`delete from quizzes where id = $1`, [data.id]);
		await audit(context.userId, "quiz.deleted", "quiz", data.id);
	} else if (data.action === "duplicate") {
		const src = await sql.query(`select * from quizzes where id = $1`, [data.id]);
		if (!src[0]) throw new AppError("Quiz not found", 404);
		const newId = nid("quiz");
		const slug = `${String(src[0].slug)}-copy-${newId.slice(-6)}`;
		await sql.query(`insert into quizzes (
          id, title, slug, description, instructions, category, difficulty, time_limit_seconds,
          passing_percentage, feedback_mode, show_explanation, show_score_immediately, randomize_questions,
          randomize_options, allow_back_navigation, allow_retake, max_attempts, matching_scoring,
          ordering_scoring, dropdown_scoring, published, active, created_by
        ) select $2, title || ' (copy)', $3, description, instructions, category, difficulty, time_limit_seconds,
          passing_percentage, feedback_mode, show_explanation, show_score_immediately, randomize_questions,
          randomize_options, allow_back_navigation, allow_retake, max_attempts, matching_scoring,
          ordering_scoring, dropdown_scoring, false, active, $4 from quizzes where id = $1`, [
			data.id,
			newId,
			slug,
			context.userId
		]);
		const qs = await sql.query(`select * from questions where quiz_id = $1`, [data.id]);
		for (const q of qs) {
			const qid = nid("q");
			await sql.query(`insert into questions (
            id, quiz_id, type, stem, instruction, explanation, difficulty, points, required_answers,
            scoring_mode, position, status, source_id, needs_review, review_note, payload
          ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb)`, [
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
				jsonText(q.payload)
			]);
		}
		await audit(context.userId, "quiz.duplicated", "quiz", newId, { from: data.id });
		return { id: newId };
	}
	return { ok: true };
});
var adminListQuestions_createServerFn_handler = createServerRpc({
	id: "92298de41fe8a56b7db0d0768da14a9ad14c44f95b603daa1bef42767f3b8c01",
	name: "adminListQuestions",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListQuestions.__executeServer(opts));
var adminListQuestions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	quizId: string().optional(),
	type: string().optional(),
	status: string().optional(),
	q: string().optional(),
	page: number().int().default(1),
	pageSize: number().int().default(25)
})).handler(adminListQuestions_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const where = [];
	const params = [];
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
	const count = await sql.query(`select count(*)::int as n from questions qq ${whereSql}`, params);
	const offset = (data.page - 1) * data.pageSize;
	params.push(data.pageSize, offset);
	return {
		rows: (await sql.query(`select qq.*, q.title as quiz_title from questions qq
       join quizzes q on q.id = qq.quiz_id ${whereSql}
       order by qq.updated_at desc limit $${params.length - 1} offset $${params.length}`, params)).map((r) => ({
			...mapQuestion(r),
			quizTitle: r.quiz_title
		})),
		total: count[0]?.n ?? 0
	};
});
var adminGetQuestion_createServerFn_handler = createServerRpc({
	id: "241edfd4b54bbe54a35c3be642b36eeda1ae90f7c46f00879955f8590aed7a17",
	name: "adminGetQuestion",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminGetQuestion.__executeServer(opts));
var adminGetQuestion = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(adminGetQuestion_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const rows = await (await getSql()).query(`select * from questions where id = $1`, [data.id]);
	if (!rows[0]) throw new AppError("Question not found", 404);
	return mapQuestion(rows[0]);
});
var adminSaveQuestion_createServerFn_handler = createServerRpc({
	id: "d0e8ad7240d6f92875edd5bc89792319b34ac77b8e0baf330815621c5949dda8",
	name: "adminSaveQuestion",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminSaveQuestion.__executeServer(opts));
var adminSaveQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(questionInput).handler(adminSaveQuestion_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const id = data.id ?? nid("q");
	const existing = await sql.query(`select id, position from questions where id = $1`, [id]);
	const pos = data.position ?? (existing[0] ? existing[0].position : ((await sql.query(`select coalesce(max(position),0)::int as n from questions where quiz_id = $1`, [data.quizId]))[0]?.n ?? 0) + 1);
	if (existing[0]) {
		await sql.query(`insert into question_versions (id, question_id, version, snapshot)
         select $2, $1, coalesce(max(version),0)+1, to_jsonb(q) from questions q, question_versions
         where q.id = $1 group by q.id`, [id, nid("qv")]).catch(async () => {
			const snap = await sql.query(`select * from questions where id = $1`, [id]);
			await sql.query(`insert into question_versions (id, question_id, version, snapshot) values ($1,$2,1,$3::jsonb)`, [
				nid("qv"),
				id,
				jsonText(snap[0])
			]);
		});
		await sql.query(`update questions set quiz_id=$2, type=$3, stem=$4, instruction=$5, explanation=$6, difficulty=$7,
         points=$8, required_answers=$9, scoring_mode=$10, position=$11, status=$12, source_id=$13,
         needs_review=$14, review_note=$15, payload=$16::jsonb, updated_at=now() where id=$1`, [
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
			jsonText(data.payload)
		]);
		await audit(context.userId, "question.edited", "question", id);
	} else {
		await sql.query(`insert into questions (
          id, quiz_id, type, stem, instruction, explanation, difficulty, points, required_answers,
          scoring_mode, position, status, source_id, needs_review, review_note, payload
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb)`, [
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
			jsonText(data.payload)
		]);
		await audit(context.userId, "question.created", "question", id);
	}
	return { id };
});
var adminDeleteQuestion_createServerFn_handler = createServerRpc({
	id: "21c09e07e6431d740ec510d7927fa8b36a540de8392528b06802b798e53940eb",
	name: "adminDeleteQuestion",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminDeleteQuestion.__executeServer(opts));
var adminDeleteQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(adminDeleteQuestion_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql()).query(`delete from questions where id = $1`, [data.id]);
	await audit(context.userId, "question.deleted", "question", data.id);
	return { ok: true };
});
var adminReorderQuestions_createServerFn_handler = createServerRpc({
	id: "30649c5ac4a0e46db094d79eaa4a943c6a3866f967bcd87bcfb6bc2484928e09",
	name: "adminReorderQuestions",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminReorderQuestions.__executeServer(opts));
var adminReorderQuestions = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	quizId: string(),
	orderedIds: array(string())
})).handler(adminReorderQuestions_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	for (let i = 0; i < data.orderedIds.length; i += 1) await sql.query(`update questions set position = $2 where id = $1 and quiz_id = $3`, [
		data.orderedIds[i],
		i + 1,
		data.quizId
	]);
	return { ok: true };
});
var adminListUsers_createServerFn_handler = createServerRpc({
	id: "9cd091d0a1b175bd96dcf2adffc8f997cf0f77ac2515ad72b0b8464750ecd0f5",
	name: "adminListUsers",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListUsers.__executeServer(opts));
var adminListUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminListUsers_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await getSql()).query(`select p.user_id, p.full_name, p.role, p.status, p.created_at::text as created_at,
              p.last_login_at::text as last_login_at,
              u.email,
              (select count(*)::int from quiz_attempts a where a.user_id = p.user_id) as attempt_count,
              (select avg(percentage) from quiz_attempts a where a.user_id = p.user_id and a.status in ('SUBMITTED','EXPIRED')) as avg_score
       from user_profiles p
       left join "user" u on u.id = p.user_id
       order by p.created_at desc`);
});
var adminUpdateUser_createServerFn_handler = createServerRpc({
	id: "d1ab20ce1e9a701427bbc979b559f8115a971f3a30e2107e0c2960433e82168a",
	name: "adminUpdateUser",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminUpdateUser.__executeServer(opts));
var adminUpdateUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string(),
	role: _enum(["USER", "ADMIN"]).optional(),
	status: _enum(["ACTIVE", "DEACTIVATED"]).optional()
})).handler(adminUpdateUser_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (data.userId === context.userId && data.role === "USER") throw new AppError("You cannot demote yourself");
	const sql = await getSql();
	if (data.role) {
		await sql.query(`update user_profiles set role = $2, updated_at = now() where user_id = $1`, [data.userId, data.role]);
		await audit(context.userId, "user.role_changed", "user", data.userId, { role: data.role });
	}
	if (data.status) {
		await sql.query(`update user_profiles set status = $2, updated_at = now() where user_id = $1`, [data.userId, data.status]);
		await audit(context.userId, data.status === "ACTIVE" ? "user.activated" : "user.deactivated", "user", data.userId);
	}
	return { ok: true };
});
var adminListResults_createServerFn_handler = createServerRpc({
	id: "a095b7a484a4beb6aa731e2622c7213380216aa1637c228906d7ce6f5280cc6d",
	name: "adminListResults",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminListResults.__executeServer(opts));
var adminListResults = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	quizId: string().optional(),
	passed: boolean().optional(),
	page: number().int().default(1),
	pageSize: number().int().default(30)
})).handler(adminListResults_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const where = [`a.status in ('SUBMITTED','EXPIRED')`];
	const params = [];
	if (data.quizId) {
		params.push(data.quizId);
		where.push(`a.quiz_id = $${params.length}`);
	}
	if (data.passed === true) where.push(`a.passed = true`);
	if (data.passed === false) where.push(`a.passed = false`);
	const whereSql = `where ${where.join(" and ")}`;
	const count = await sql.query(`select count(*)::int as n from quiz_attempts a ${whereSql}`, params);
	const offset = (data.page - 1) * data.pageSize;
	params.push(data.pageSize, offset);
	return {
		rows: await sql.query(`select a.id, coalesce(p.full_name, u.email, a.user_id) as user_name, u.email,
              q.title as quiz_title, a.attempt_number, a.score, a.percentage, a.passed,
              a.time_used_seconds, a.started_at::text as started_at, a.submitted_at::text as submitted_at, a.status
       from quiz_attempts a
       join quizzes q on q.id = a.quiz_id
       left join user_profiles p on p.user_id = a.user_id
       left join "user" u on u.id = a.user_id
       ${whereSql} order by a.submitted_at desc nulls last
       limit $${params.length - 1} offset $${params.length}`, params),
		total: count[0]?.n ?? 0
	};
});
var adminExportResultsCsv_createServerFn_handler = createServerRpc({
	id: "e443c13f113ad7a85e49765db39952bc72dc6e661fd1b6298a2d2630e268c18f",
	name: "adminExportResultsCsv",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminExportResultsCsv.__executeServer(opts));
var adminExportResultsCsv = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminExportResultsCsv_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const rows = await (await getSql()).query(`select a.id, coalesce(p.full_name,'') as user_name, u.email, q.title as quiz, a.attempt_number,
              a.score, a.max_score, a.percentage, a.passed, a.correct_count, a.incorrect_count,
              a.unanswered_count, a.time_used_seconds, a.started_at::text as started_at, a.submitted_at::text as submitted_at, a.status
       from quiz_attempts a
       join quizzes q on q.id = a.quiz_id
       left join user_profiles p on p.user_id = a.user_id
       left join "user" u on u.id = a.user_id
       where a.status in ('SUBMITTED','EXPIRED')
       order by a.submitted_at desc`);
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
		"status"
	];
	return { csv: [headers.join(","), ...rows.map((r) => headers.map((h) => {
		const v = r[h];
		const s = v == null ? "" : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	}).join(","))].join("\n") };
});
var adminExportQuestionsJson_createServerFn_handler = createServerRpc({
	id: "f2187bbe74f13b78bdd13192d97ef92901942c595c3773539cca4411ec9d4233",
	name: "adminExportQuestionsJson",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminExportQuestionsJson.__executeServer(opts));
var adminExportQuestionsJson = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ quizId: string().optional() })).handler(adminExportQuestionsJson_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	const sql = await getSql();
	const params = [];
	let where = "";
	if (data.quizId) {
		params.push(data.quizId);
		where = "where quiz_id = $1";
	}
	return { questions: (await sql.query(`select * from questions ${where} order by quiz_id, position`, params)).map((r) => mapQuestion(r)) };
});
var adminAnalytics_createServerFn_handler = createServerRpc({
	id: "4707c7cde686bd396c18c3055fb40ae922947f6c493d76fa942549e690d704ff",
	name: "adminAnalytics",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminAnalytics.__executeServer(opts));
var adminAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminAnalytics_createServerFn_handler, async ({ context }) => {
	await ensureSeeded();
	await requireAdmin(context.userId);
	const sql = await getSql();
	const overview = await sql.query(`select count(*)::int as attempts,
              count(distinct user_id)::int as users,
              avg(percentage) as avg,
              avg(case when passed then 1.0 else 0.0 end) as pass,
              avg(time_used_seconds) as avg_time
       from quiz_attempts where status in ('SUBMITTED','EXPIRED')`);
	const byDay = await sql.query(`select to_char(date_trunc('day', submitted_at), 'YYYY-MM-DD') as day,
              count(*)::int as n, avg(percentage) as avg
       from quiz_attempts
       where status in ('SUBMITTED','EXPIRED') and submitted_at is not null
       group by 1 order by 1`);
	const passFail = await sql.query(`select passed, count(*)::int as n from quiz_attempts
       where status in ('SUBMITTED','EXPIRED') group by passed`);
	const byType = await sql.query(`select (aq.snapshot->>'type') as type,
              count(*)::int as attempts,
              sum(case when aa.is_correct then 1 else 0 end)::int as correct
       from attempt_answers aa
       join attempt_questions aq on aq.attempt_id = aa.attempt_id and aq.question_id = aa.question_id
       join quiz_attempts a on a.id = aa.attempt_id
       where a.status in ('SUBMITTED','EXPIRED')
       group by 1 order by 1`);
	const missed = await sql.query(`select aa.question_id,
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
       limit 12`);
	const o = overview[0];
	const nums = (await sql.query(`select percentage from quiz_attempts where status in ('SUBMITTED','EXPIRED') and percentage is not null order by percentage`)).map((s) => Number(s.percentage));
	const median = nums.length === 0 ? null : nums.length % 2 ? nums[(nums.length - 1) / 2] : (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2;
	return {
		attempts: o?.attempts ?? 0,
		uniqueUsers: o?.users ?? 0,
		averageScore: o?.avg == null ? null : Number(o.avg),
		medianScore: median,
		passRate: o?.pass == null ? null : Number(o.pass),
		averageTime: o?.avg_time == null ? null : Number(o.avg_time),
		byDay: byDay.map((d) => ({
			day: d.day,
			attempts: d.n,
			average: d.avg == null ? 0 : Number(d.avg)
		})),
		passFail,
		byType: byType.map((t) => ({
			type: t.type,
			attempts: t.attempts,
			correct: t.correct,
			success: t.attempts ? t.correct / t.attempts : 0
		})),
		missed: missed.map((m) => ({
			id: m.question_id,
			stem: m.stem,
			attempts: m.attempts,
			correct: m.correct,
			success: m.attempts ? m.correct / m.attempts : 0
		}))
	};
});
var adminAuditLog_createServerFn_handler = createServerRpc({
	id: "5974acef8930f9f877f027a3c9b6b914809f3a7b814af41628ad8de774ca014e",
	name: "adminAuditLog",
	filename: "src/lib/server/admin.ts"
}, (opts) => adminAuditLog.__executeServer(opts));
var adminAuditLog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(adminAuditLog_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await getSql()).query(`select id, actor_id, action, entity_type, entity_id, created_at::text as created_at
       from audit_logs order by created_at desc limit 200`);
});
var requestPasswordReset_createServerFn_handler = createServerRpc({
	id: "0d7a2008c9aeed51769a84e1b5497a7760182de8b655d262587be74b747fd696",
	name: "requestPasswordReset",
	filename: "src/lib/server/admin.ts"
}, (opts) => requestPasswordReset.__executeServer(opts));
var requestPasswordReset = createServerFn({ method: "POST" }).validator(object({ email: string().email() })).handler(requestPasswordReset_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const users = await sql.query(`select id, email from "user" where lower(email) = lower($1)`, [data.email]);
	const generic = {
		ok: true,
		resetPath: null
	};
	if (!users[0]) return generic;
	const token = nid("rst").replace(/-/g, "");
	const { hashPassword } = await import("./crypto-CRvWCAfw.mjs").then((n) => n.t).then((n) => n.t);
	const tokenHash = await hashPassword(token);
	await sql.query(`insert into password_reset_tokens (id, user_id, email, token_hash, expires_at)
       values ($1,$2,$3,$4, now() + interval '1 hour')`, [
		nid("prt"),
		users[0].id,
		users[0].email,
		tokenHash
	]);
	return {
		ok: true,
		resetPath: `/reset-password?token=${token}`
	};
});
var completePasswordReset_createServerFn_handler = createServerRpc({
	id: "9e64d658d9f516fd1bd7be82b34e9b0db2ef496367ad2bf6cc67a6db33db9302",
	name: "completePasswordReset",
	filename: "src/lib/server/admin.ts"
}, (opts) => completePasswordReset.__executeServer(opts));
var completePasswordReset = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	password: string().min(8)
})).handler(completePasswordReset_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql.query(`select id, user_id, token_hash from password_reset_tokens
       where used_at is null and expires_at > now() order by expires_at desc`);
	const { verifyPassword, hashPassword } = await import("./crypto-CRvWCAfw.mjs").then((n) => n.t).then((n) => n.t);
	let match = null;
	for (const row of rows) if (await verifyPassword({
		hash: row.token_hash,
		password: data.token
	})) {
		match = row;
		break;
	}
	if (!match) throw new AppError("Invalid or expired reset link");
	const passwordHash = await hashPassword(data.password);
	await sql.query(`update account set password = $2, "updatedAt" = now()
       where "userId" = $1 and "providerId" = 'credential'`, [match.user_id, passwordHash]);
	await sql.query(`update password_reset_tokens set used_at = now() where id = $1`, [match.id]);
	return { ok: true };
});
//#endregion
export { adminAnalytics_createServerFn_handler, adminAuditLog_createServerFn_handler, adminDeleteQuestion_createServerFn_handler, adminExportQuestionsJson_createServerFn_handler, adminExportResultsCsv_createServerFn_handler, adminGetQuestion_createServerFn_handler, adminGetQuiz_createServerFn_handler, adminListQuestions_createServerFn_handler, adminListQuizzes_createServerFn_handler, adminListResults_createServerFn_handler, adminListUsers_createServerFn_handler, adminOverview_createServerFn_handler, adminQuizAction_createServerFn_handler, adminReorderQuestions_createServerFn_handler, adminSaveQuestion_createServerFn_handler, adminSaveQuiz_createServerFn_handler, adminUpdateUser_createServerFn_handler, completePasswordReset_createServerFn_handler, requestPasswordReset_createServerFn_handler };
