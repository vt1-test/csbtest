import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CWZoMa8v.mjs";
import { t as QUESTION_TYPES } from "./types-CfSM8BPy.mjs";
import { _n as object, bn as string, cn as _enum, dn as boolean, fn as custom, gn as number, un as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-2c96sBmI.js
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
var adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b0810fbd9f9f0856d1b14e3fa48305c27383e99a16fd93e99113c7c1e713f6ee"));
var adminListQuizzes = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	q: string().optional(),
	category: string().optional(),
	page: number().int().default(1),
	pageSize: number().int().default(20)
})).handler(createSsrRpc("8ba26361e30490465ac8d7388877fa99a961960ecce4b78fc9e3291441b79b7b"));
var adminGetQuiz = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("691a0dd8e211f7576a7351ac548afe8c8e4056c09f6a8ac5fca68ec90c624d99"));
var adminSaveQuiz = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(quizInput).handler(createSsrRpc("84232cf61fa92bceb1336a05e72c880101c35d75316cd679bbfca5f20aad037c"));
var adminQuizAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	action: _enum([
		"publish",
		"unpublish",
		"archive",
		"delete",
		"duplicate"
	])
})).handler(createSsrRpc("7d4ae05742af54729e7396225142aaac3205f2a180acdefc8ba82bb0a1882d66"));
var adminListQuestions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	quizId: string().optional(),
	type: string().optional(),
	status: string().optional(),
	q: string().optional(),
	page: number().int().default(1),
	pageSize: number().int().default(25)
})).handler(createSsrRpc("92298de41fe8a56b7db0d0768da14a9ad14c44f95b603daa1bef42767f3b8c01"));
var adminGetQuestion = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("241edfd4b54bbe54a35c3be642b36eeda1ae90f7c46f00879955f8590aed7a17"));
var adminSaveQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(questionInput).handler(createSsrRpc("d0e8ad7240d6f92875edd5bc89792319b34ac77b8e0baf330815621c5949dda8"));
var adminDeleteQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("21c09e07e6431d740ec510d7927fa8b36a540de8392528b06802b798e53940eb"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	quizId: string(),
	orderedIds: array(string())
})).handler(createSsrRpc("30649c5ac4a0e46db094d79eaa4a943c6a3866f967bcd87bcfb6bc2484928e09"));
var adminListUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9cd091d0a1b175bd96dcf2adffc8f997cf0f77ac2515ad72b0b8464750ecd0f5"));
var adminUpdateUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string(),
	role: _enum(["USER", "ADMIN"]).optional(),
	status: _enum(["ACTIVE", "DEACTIVATED"]).optional()
})).handler(createSsrRpc("d1ab20ce1e9a701427bbc979b559f8115a971f3a30e2107e0c2960433e82168a"));
var adminListResults = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({
	quizId: string().optional(),
	passed: boolean().optional(),
	page: number().int().default(1),
	pageSize: number().int().default(30)
})).handler(createSsrRpc("a095b7a484a4beb6aa731e2622c7213380216aa1637c228906d7ce6f5280cc6d"));
var adminExportResultsCsv = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e443c13f113ad7a85e49765db39952bc72dc6e661fd1b6298a2d2630e268c18f"));
var adminExportQuestionsJson = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ quizId: string().optional() })).handler(createSsrRpc("f2187bbe74f13b78bdd13192d97ef92901942c595c3773539cca4411ec9d4233"));
var adminAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4707c7cde686bd396c18c3055fb40ae922947f6c493d76fa942549e690d704ff"));
var adminAuditLog = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5974acef8930f9f877f027a3c9b6b914809f3a7b814af41628ad8de774ca014e"));
var requestPasswordReset = createServerFn({ method: "POST" }).validator(object({ email: string().email() })).handler(createSsrRpc("0d7a2008c9aeed51769a84e1b5497a7760182de8b655d262587be74b747fd696"));
var completePasswordReset = createServerFn({ method: "POST" }).validator(object({
	token: string(),
	password: string().min(8)
})).handler(createSsrRpc("9e64d658d9f516fd1bd7be82b34e9b0db2ef496367ad2bf6cc67a6db33db9302"));
//#endregion
export { completePasswordReset as _, adminExportResultsCsv as a, adminListQuestions as c, adminListUsers as d, adminOverview as f, adminUpdateUser as g, adminSaveQuiz as h, adminExportQuestionsJson as i, adminListQuizzes as l, adminSaveQuestion as m, adminAuditLog as n, adminGetQuestion as o, adminQuizAction as p, adminDeleteQuestion as r, adminGetQuiz as s, adminAnalytics as t, adminListResults as u, requestPasswordReset as v };
