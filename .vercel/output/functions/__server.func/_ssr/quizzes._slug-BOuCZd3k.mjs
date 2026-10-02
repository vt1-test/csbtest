import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatDuration } from "./utils-DtDPPULZ.mjs";
import { h as useCurrentUserState, l as getMyQuizProgress, p as startAttempt } from "./attempts-B_4CXuRN.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Badge } from "./badge-Dsc440nc.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { t as getQuizBySlug } from "./public-D47-UuFG.mjs";
import { i as Route } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quizzes._slug-BOuCZd3k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizDetails() {
	const { slug } = Route.useParams();
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const quiz = useQuery({
		queryKey: ["quiz", slug],
		queryFn: () => getQuizBySlug({ data: { slug } })
	});
	const progress = useQuery({
		queryKey: [
			"progress",
			quiz.data?.id,
			user?.id
		],
		queryFn: () => getMyQuizProgress({ data: { quizId: quiz.data.id } }),
		enabled: Boolean(user && quiz.data)
	});
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function start(mode) {
		if (!quiz.data) return;
		setBusy(mode);
		setError(null);
		try {
			const res = await startAttempt({ data: {
				quizId: quiz.data.id,
				mode
			} });
			navigate({
				to: "/exam/$attemptId",
				params: { attemptId: res.attemptId }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not start");
		} finally {
			setBusy(null);
		}
	}
	if (quiz.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-3xl px-4 py-16 text-sm text-muted",
			children: "Loading exam…"
		})]
	});
	if (!quiz.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl",
				children: "Exam not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "This exam is unpublished, archived, or does not exist."
			})]
		})]
	});
	const q = quiz.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "info",
								children: q.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: q.difficulty }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: q.published ? "success" : "neutral",
								children: q.published ? "Published" : "Draft"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-serif text-3xl font-semibold",
						children: q.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: q.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 text-sm sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Questions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: q.questionCount
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Time limit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: formatDuration(q.timeLimitSeconds)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Passing score"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-medium",
								children: [q.passingPercentage, "%"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Attempts"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: q.maxAttempts == null ? "Unlimited" : q.maxAttempts
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8 rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-lg font-semibold",
								children: "Instructions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted",
								children: q.instructions
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 list-disc space-y-1 pl-5 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The timer is enforced on the server. Closing the tab does not pause it." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: q.allowBackNavigation ? "You may move backward between questions." : "Back navigation is disabled." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Practice mode shows correctness and explanations after each answer. Exam mode hides the key until submit." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Unanswered questions are scored as incorrect. Submit is confirmed before it locks." })
								]
							})
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-3 sm:flex-row",
						children: [
							isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Checking session…"
							}) : null,
							!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "Sign in to start"
								})
							}) : null,
							user && progress.data?.inProgressId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/exam/$attemptId",
									params: { attemptId: progress.data.inProgressId },
									children: "Resume quiz"
								})
							}) : null,
							user && !progress.data?.inProgressId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busy !== null || progress.data?.canStart === false,
								onClick: () => start("EXAM"),
								children: busy === "EXAM" ? "Starting…" : "Start exam"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: busy !== null || progress.data?.canStart === false,
								onClick: () => start("PRACTICE"),
								children: busy === "PRACTICE" ? "Starting…" : "Practice mode"
							})] }) : null
						]
					}),
					progress.data?.attemptsRemaining != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [progress.data.attemptsRemaining, " attempt(s) remaining."]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { QuizDetails as component };
