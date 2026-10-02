import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatDateTime, r as formatDuration } from "./utils-DtDPPULZ.mjs";
import { a as getAttemptResult, h as useCurrentUserState, t as RedirectToSignIn } from "./attempts-B_4CXuRN.mjs";
import { t as Card } from "./card-D98fSIK0.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as QuestionRenderer } from "./question-renderer-96Awxkzp.mjs";
import { t as Badge } from "./badge-Dsc440nc.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { n as QuestionNavigator, t as FeedbackBanner } from "./question-navigator-DdTt2ugK.mjs";
import { n as Route } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results._attemptId-Br7LMJr3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResultPage() {
	const { attemptId } = Route.useParams();
	const { user, isPending } = useCurrentUserState();
	const result = useQuery({
		queryKey: ["result", attemptId],
		queryFn: () => getAttemptResult({ data: { attemptId } }),
		enabled: Boolean(user)
	});
	const [open, setOpen] = (0, import_react.useState)(null);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted",
		children: "Loading…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (result.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-4xl px-4 py-16 text-sm text-muted",
			children: "Scoring your attempt…"
		})]
	});
	if (result.error || !result.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-4xl px-4 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: result.error instanceof Error ? result.error.message : "Result unavailable."
			})
		})]
	});
	const { attempt, review } = result.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: attempt.quizTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-serif text-3xl font-semibold",
						children: "Results"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-4 sm:grid-cols-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5 sm:col-span-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase text-muted",
									children: "Score"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-serif text-4xl font-semibold tabular-nums",
									children: [attempt.percentage?.toFixed(0), "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "mt-2",
									tone: attempt.passed ? "success" : "danger",
									children: attempt.passed ? "Pass" : "Fail"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-5 sm:col-span-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-3 text-sm sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Attempt"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: attempt.attemptNumber
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Submitted"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: formatDateTime(attempt.submittedAt)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Time used"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: attempt.timeUsedSeconds ? formatDuration(attempt.timeUsedSeconds) : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Correct"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: attempt.correctCount
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Incorrect"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: attempt.incorrectCount
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Unanswered"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-medium",
										children: attempt.unansweredCount
									})] })
								]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-xl font-semibold",
								children: "Review answers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionNavigator, {
									items: review.map((r) => ({
										id: r.question.id,
										marked: false,
										answered: !r.unanswered,
										correct: r.unanswered ? false : r.isCorrect
									})),
									currentIndex: open ?? 0,
									onSelect: (i) => setOpen(i),
									review: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 space-y-4",
								children: review.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "p-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-medium",
												children: ["Question ", item.position]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone: item.unanswered ? "warning" : item.isCorrect ? "success" : "danger",
												children: item.unanswered ? "Unanswered" : item.isCorrect ? "Correct" : "Incorrect"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed",
											children: item.question.stem
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4 opacity-90",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionRenderer, {
												question: item.exam,
												value: item.answer,
												onChange: () => void 0,
												disabled: true
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 space-y-1 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: "Your answer: "
											}), item.userAnswerLabel] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: "Correct answer: "
											}), item.correctAnswerLabel] })]
										}),
										item.question.explanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackBanner, {
												correct: item.isCorrect,
												explanation: item.question.explanation,
												correctAnswer: item.correctAnswerLabel
											})
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sr-only",
											children: i
										})
									]
								}, item.question.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								children: "Back to dashboard"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { ResultPage as component };
