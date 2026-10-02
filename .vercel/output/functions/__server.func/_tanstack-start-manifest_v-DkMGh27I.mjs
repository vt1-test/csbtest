//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-DkMGh27I.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/admin",
			"/dashboard",
			"/forgot-password",
			"/login",
			"/privacy",
			"/reset-password",
			"/signup",
			"/terms",
			"/exam/$attemptId",
			"/quizzes/$slug",
			"/results/$attemptId",
			"/quizzes/",
			"/api/auth/$"
		],
		preloads: [
			"/assets/index-BWeqEkJr.js",
			"/assets/react-DB-4Zxce.js",
			"/assets/preload-helper-CxJj0IK2.js",
			"/assets/link-xBhvML8s.js",
			"/assets/useMatch-DY60ptb9.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-BWeqEkJr.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-BC5cak8C.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/clock-DH5bFWgL.js",
			"/assets/quiz-card-G-WHsHm8.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/public-header-BM4MDtLM.js",
			"/assets/public-C7VhQVcl.js"
		]
	},
	"/admin": {
		filePath: "/workspace/src/routes/admin.tsx",
		children: [
			"/admin/analytics",
			"/admin/import",
			"/admin/questions",
			"/admin/quizzes",
			"/admin/results",
			"/admin/settings",
			"/admin/users",
			"/admin/"
		],
		preloads: [
			"/assets/admin-DPbbi-Lx.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/attempts-jeVEeNRn.js"
		]
	},
	"/dashboard": {
		filePath: "/workspace/src/routes/dashboard.tsx",
		children: void 0,
		preloads: [
			"/assets/dashboard-Bn44aRrG.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/quiz-card-G-WHsHm8.js",
			"/assets/card-BFtYP6E8.js",
			"/assets/generateCategoricalChart-BqDwxiKq.js",
			"/assets/attempts-jeVEeNRn.js",
			"/assets/public-header-BM4MDtLM.js",
			"/assets/public-C7VhQVcl.js"
		]
	},
	"/forgot-password": {
		filePath: "/workspace/src/routes/forgot-password.tsx",
		children: void 0,
		preloads: [
			"/assets/forgot-password-DvZyw8Uq.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/label-BjO6DDKm.js",
			"/assets/public-header-BM4MDtLM.js"
		]
	},
	"/login": {
		filePath: "/workspace/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-CjTvL1bn.js",
			"/assets/client-bLCk0icn.js",
			"/assets/providers-R25ah5Ot.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/label-BjO6DDKm.js",
			"/assets/public-header-BM4MDtLM.js"
		]
	},
	"/privacy": {
		filePath: "/workspace/src/routes/privacy.tsx",
		children: void 0,
		preloads: ["/assets/privacy-BoJxL0FX.js", "/assets/public-header-BM4MDtLM.js"]
	},
	"/reset-password": {
		filePath: "/workspace/src/routes/reset-password.tsx",
		children: void 0,
		preloads: [
			"/assets/reset-password-DRyP2QPQ.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/label-BjO6DDKm.js",
			"/assets/public-header-BM4MDtLM.js"
		]
	},
	"/signup": {
		filePath: "/workspace/src/routes/signup.tsx",
		children: void 0,
		preloads: [
			"/assets/signup-BYixqkAO.js",
			"/assets/client-bLCk0icn.js",
			"/assets/providers-R25ah5Ot.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/label-BjO6DDKm.js",
			"/assets/public-header-BM4MDtLM.js"
		]
	},
	"/terms": {
		filePath: "/workspace/src/routes/terms.tsx",
		children: void 0,
		preloads: ["/assets/terms-Bcbrqulq.js", "/assets/public-header-BM4MDtLM.js"]
	},
	"/admin/analytics": {
		filePath: "/workspace/src/routes/admin.analytics.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.analytics-FiIm4B4T.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/card-BFtYP6E8.js",
			"/assets/generateCategoricalChart-BqDwxiKq.js"
		]
	},
	"/admin/import": {
		filePath: "/workspace/src/routes/admin.import.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.import-CfEMQ68s.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/textarea-DTk9Mf2d.js"
		]
	},
	"/admin/questions": {
		filePath: "/workspace/src/routes/admin.questions.tsx",
		children: ["/admin/questions/$id"],
		preloads: [
			"/assets/admin.questions-BDf1a0-E.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/types-CoMf3LIx.js"
		]
	},
	"/admin/quizzes": {
		filePath: "/workspace/src/routes/admin.quizzes.tsx",
		children: ["/admin/quizzes/$id"],
		preloads: [
			"/assets/admin.quizzes-Be-nQXcJ.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/badge-DlMnyD5r.js"
		]
	},
	"/admin/results": {
		filePath: "/workspace/src/routes/admin.results.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.results-C1raUHIX.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js"
		]
	},
	"/admin/settings": {
		filePath: "/workspace/src/routes/admin.settings.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.settings-BH5nawcl.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/button-cTPPBnRi.js"
		]
	},
	"/admin/users": {
		filePath: "/workspace/src/routes/admin.users.tsx",
		children: void 0,
		preloads: ["/assets/admin.users-DRWHGnut.js", "/assets/admin-CGc7Aygu.js"]
	},
	"/exam/$attemptId": {
		filePath: "/workspace/src/routes/exam.$attemptId.tsx",
		children: void 0,
		preloads: [
			"/assets/exam._attemptId-BV0ZWCP5.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/question-renderer-p7ZAvTod.js",
			"/assets/clock-DH5bFWgL.js",
			"/assets/useMutation-C7JOnBwk.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/scoring-DWtDwO4w.js",
			"/assets/attempts-jeVEeNRn.js",
			"/assets/question-navigator-D0BPTpj7.js"
		]
	},
	"/quizzes/$slug": {
		filePath: "/workspace/src/routes/quizzes.$slug.tsx",
		children: void 0,
		preloads: [
			"/assets/quizzes._slug-Dzf-i5-r.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/badge-DlMnyD5r.js",
			"/assets/attempts-jeVEeNRn.js",
			"/assets/public-header-BM4MDtLM.js",
			"/assets/public-C7VhQVcl.js"
		]
	},
	"/results/$attemptId": {
		filePath: "/workspace/src/routes/results.$attemptId.tsx",
		children: void 0,
		preloads: [
			"/assets/results._attemptId-B6IXhHkK.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/question-renderer-p7ZAvTod.js",
			"/assets/card-BFtYP6E8.js",
			"/assets/button-cTPPBnRi.js",
			"/assets/badge-DlMnyD5r.js",
			"/assets/attempts-jeVEeNRn.js",
			"/assets/public-header-BM4MDtLM.js",
			"/assets/question-navigator-D0BPTpj7.js"
		]
	},
	"/admin/": {
		filePath: "/workspace/src/routes/admin.index.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.index-BCf0zmDg.js",
			"/assets/admin-CGc7Aygu.js",
			"/assets/card-BFtYP6E8.js"
		]
	},
	"/quizzes/": {
		filePath: "/workspace/src/routes/quizzes.index.tsx",
		children: void 0,
		preloads: [
			"/assets/quizzes.index-D26PFWpW.js",
			"/assets/utils-uTv6U-EJ.js",
			"/assets/quiz-card-G-WHsHm8.js",
			"/assets/input-UE5ABRo_.js",
			"/assets/public-header-BM4MDtLM.js",
			"/assets/public-C7VhQVcl.js"
		]
	},
	"/admin/questions/$id": {
		filePath: "/workspace/src/routes/admin.questions.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.questions._id-DJjGB7Oz.js",
			"/assets/question-renderer-p7ZAvTod.js",
			"/assets/useMutation-C7JOnBwk.js",
			"/assets/textarea-DTk9Mf2d.js",
			"/assets/label-BjO6DDKm.js",
			"/assets/scoring-DWtDwO4w.js"
		]
	},
	"/admin/quizzes/$id": {
		filePath: "/workspace/src/routes/admin.quizzes.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/admin.quizzes._id-Da4A-7eV.js",
			"/assets/useMutation-C7JOnBwk.js",
			"/assets/textarea-DTk9Mf2d.js",
			"/assets/label-BjO6DDKm.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
