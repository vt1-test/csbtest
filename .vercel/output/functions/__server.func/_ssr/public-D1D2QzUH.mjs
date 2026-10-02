import { n as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CZxOMQ2J.mjs";
import { r as createServerRpc } from "./helpers-VgSEk9M3.mjs";
import { t as ensureSeeded } from "./seed-0puB-6M7.mjs";
import { _n as object, bn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-D1D2QzUH.js
function mapQuiz(row) {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		description: row.description,
		instructions: row.instructions,
		category: row.category,
		difficulty: row.difficulty,
		timeLimitSeconds: row.time_limit_seconds,
		passingPercentage: row.passing_percentage,
		feedbackMode: row.feedback_mode,
		showExplanation: row.show_explanation,
		showScoreImmediately: row.show_score_immediately,
		randomizeQuestions: row.randomize_questions,
		randomizeOptions: row.randomize_options,
		allowBackNavigation: row.allow_back_navigation,
		allowRetake: row.allow_retake,
		maxAttempts: row.max_attempts,
		matchingScoring: row.matching_scoring,
		orderingScoring: row.ordering_scoring,
		dropdownScoring: row.dropdown_scoring,
		published: row.published,
		active: row.active,
		archived: row.archived,
		questionCount: Number(row.question_count),
		attemptCount: Number(row.attempt_count ?? 0),
		averageScore: row.average_score == null ? null : Number(row.average_score)
	};
}
var QUIZ_SELECT = `
  select q.*,
    (select count(*)::int from questions qq where qq.quiz_id = q.id and qq.status = 'published') as question_count,
    (select count(*)::int from quiz_attempts a where a.quiz_id = q.id and a.status in ('SUBMITTED','EXPIRED')) as attempt_count,
    (select avg(percentage) from quiz_attempts a where a.quiz_id = q.id and a.status in ('SUBMITTED','EXPIRED')) as average_score
  from quizzes q
`;
var listPublishedQuizzes_createServerFn_handler = createServerRpc({
	id: "9537fdb74f5214107b24c7b077aece050484533bddd4edd410ba1268d66b5600",
	name: "listPublishedQuizzes",
	filename: "src/lib/server/public.ts"
}, (opts) => listPublishedQuizzes.__executeServer(opts));
var listPublishedQuizzes = createServerFn({ method: "GET" }).handler(listPublishedQuizzes_createServerFn_handler, async () => {
	await ensureSeeded();
	return (await (await getSql()).query(`${QUIZ_SELECT} where q.published = true and q.active = true and q.archived = false order by q.title`)).map(mapQuiz);
});
var getQuizBySlug_createServerFn_handler = createServerRpc({
	id: "55e6f430b2e0f2a6755fc598b1a1e5fb531f515a91c7736b36b6c3e14c21212c",
	name: "getQuizBySlug",
	filename: "src/lib/server/public.ts"
}, (opts) => getQuizBySlug.__executeServer(opts));
var getQuizBySlug = createServerFn({ method: "GET" }).validator(object({ slug: string() })).handler(getQuizBySlug_createServerFn_handler, async ({ data }) => {
	await ensureSeeded();
	const quiz = (await (await getSql()).query(`${QUIZ_SELECT} where q.slug = $1`, [data.slug]))[0];
	if (!quiz || !quiz.published || !quiz.active || quiz.archived) return null;
	return mapQuiz(quiz);
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "25c30f9877ad4b3ee9a578e88aff20184b39c56b41305d633cae024713634ca0",
	name: "listCategories",
	filename: "src/lib/server/public.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).handler(listCategories_createServerFn_handler, async () => {
	await ensureSeeded();
	return await (await getSql()).query(`select category, count(*)::int as n from quizzes
     where published = true and active = true and archived = false
     group by category order by category`);
});
//#endregion
export { getQuizBySlug_createServerFn_handler, listCategories_createServerFn_handler, listPublishedQuizzes_createServerFn_handler };
