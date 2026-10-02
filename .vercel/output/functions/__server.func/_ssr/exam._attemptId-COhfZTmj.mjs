import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatDuration, t as cn } from "./utils-DtDPPULZ.mjs";
import { d as markQuestion, f as saveAnswer, h as useCurrentUserState, m as submitAttempt, s as getExamState, t as RedirectToSignIn, u as heartbeatAttempt } from "./attempts-B_4CXuRN.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { r as isAnswered } from "./scoring-jGSfDrnQ.mjs";
import { c as LayoutGrid, g as ChevronLeft, h as ChevronRight, t as X, u as Clock, y as Bookmark } from "../_libs/lucide-react.mjs";
import { t as QuestionRenderer } from "./question-renderer-96Awxkzp.mjs";
import { n as QuestionNavigator, t as FeedbackBanner } from "./question-navigator-DdTt2ugK.mjs";
import { a as Route } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exam._attemptId-COhfZTmj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExamTimer({ remaining }) {
	const state = remaining <= 0 ? "expired" : remaining <= 60 ? "critical" : remaining <= 300 ? "warning" : "normal";
	const label = state === "expired" ? "Time expired" : state === "critical" ? "Less than one minute remaining" : state === "warning" ? "Five minutes remaining" : "Time remaining";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2 rounded-md px-3 py-1.5 font-medium tabular-nums", state === "normal" && "bg-option text-fg", state === "warning" && "bg-warning/15 text-warning", state === "critical" && "bg-danger/15 text-danger", state === "expired" && "bg-danger text-white"),
		role: "timer",
		"aria-label": label,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
				className: "size-4",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDuration(remaining) }),
			state !== "normal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium uppercase tracking-wide",
				children: state === "expired" ? "Expired" : state === "critical" ? "Critical" : "Warning"
			}) : null
		]
	});
}
function Progress({ value, className }) {
	const v = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-2 w-full overflow-hidden rounded-full bg-option", className),
		role: "progressbar",
		"aria-valuenow": v,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-primary transition-[width] duration-300",
			style: { width: `${v}%` }
		})
	});
}
function ExamPage() {
	const { attemptId } = Route.useParams();
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const state = useQuery({
		queryKey: ["exam", attemptId],
		queryFn: () => getExamState({ data: { attemptId } }),
		refetchOnWindowFocus: false
	});
	const [index, setIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [marked, setMarked] = (0, import_react.useState)({});
	const [feedback, setFeedback] = (0, import_react.useState)({});
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const [remaining, setRemaining] = (0, import_react.useState)(null);
	const [navOpen, setNavOpen] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const hydrated = (0, import_react.useRef)(false);
	const saveTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!state.data || hydrated.current) return;
		hydrated.current = true;
		setAnswers(state.data.answers ?? {});
		setFeedback(state.data.feedback ?? {});
		setRemaining(state.data.remainingSeconds);
		const map = {};
		for (const n of state.data.navigator) map[n.id] = n.marked;
		setMarked(map);
	}, [state.data]);
	(0, import_react.useEffect)(() => {
		if (!state.data || state.data.attempt.status !== "IN_PROGRESS" || remaining == null) return;
		const id = window.setInterval(() => setRemaining((s) => s == null ? s : Math.max(0, s - 1)), 1e3);
		return () => window.clearInterval(id);
	}, [state.data, remaining == null]);
	(0, import_react.useEffect)(() => {
		if (!state.data || state.data.attempt.status !== "IN_PROGRESS") return;
		const id = window.setInterval(async () => {
			try {
				const beat = await heartbeatAttempt({ data: { attemptId } });
				setRemaining(beat.remainingSeconds);
				if (beat.status !== "IN_PROGRESS") navigate({
					to: "/results/$attemptId",
					params: { attemptId }
				});
			} catch {}
		}, 2e4);
		return () => window.clearInterval(id);
	}, [
		attemptId,
		navigate,
		state.data
	]);
	const submitMut = useMutation({
		mutationFn: () => submitAttempt({ data: { attemptId } }),
		onSuccess: () => navigate({
			to: "/results/$attemptId",
			params: { attemptId }
		})
	});
	(0, import_react.useEffect)(() => {
		if (remaining === 0 && hydrated.current && state.data?.attempt.status === "IN_PROGRESS" && !submitting) {
			setSubmitting(true);
			submitMut.mutateAsync();
		}
	}, [
		remaining,
		state.data,
		submitMut,
		submitting
	]);
	(0, import_react.useEffect)(() => {
		const onLeave = (e) => {
			if (state.data?.attempt.status === "IN_PROGRESS") {
				e.preventDefault();
				e.returnValue = "Your quiz is still in progress.";
			}
		};
		window.addEventListener("beforeunload", onLeave);
		return () => window.removeEventListener("beforeunload", onLeave);
	}, [state.data]);
	const persist = (0, import_react.useCallback)(async (questionId, answer, attempt = 0) => {
		setSaveState("saving");
		try {
			const res = await saveAnswer({ data: {
				attemptId,
				questionId,
				answer
			} });
			setSaveState("saved");
			setRemaining(res.remainingSeconds);
			if ("feedback" in res && res.feedback) setFeedback((prev) => ({
				...prev,
				[questionId]: res.feedback ?? void 0
			}));
			window.setTimeout(() => setSaveState("idle"), 1200);
		} catch {
			if (attempt < 2) {
				window.setTimeout(() => {
					persist(questionId, answer, attempt + 1);
				}, 800 * (attempt + 1));
				return;
			}
			setSaveState("error");
		}
	}, [attemptId]);
	function queueSave(questionId, answer) {
		setAnswers((prev) => ({
			...prev,
			[questionId]: answer
		}));
		if (saveTimer.current) window.clearTimeout(saveTimer.current);
		saveTimer.current = window.setTimeout(() => {
			persist(questionId, answer);
		}, 400);
	}
	const data = state.data;
	const questions = data?.questions ?? [];
	const current = questions[index];
	const answeredCount = questions.filter((q) => isAnswered(q.type, answers[q.id])).length;
	const markedCount = Object.values(marked).filter(Boolean).length;
	async function toggleMark() {
		if (!current) return;
		const next = !marked[current.id];
		setMarked((p) => ({
			...p,
			[current.id]: next
		}));
		await markQuestion({ data: {
			attemptId,
			questionId: current.id,
			marked: next
		} });
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted",
		children: "Loading session…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (state.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted",
		children: "Loading exam…"
	});
	if (state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			children: state.error instanceof Error ? state.error.message : "Unable to load this attempt."
		})
	});
	if (data && data.attempt.status !== "IN_PROGRESS") {
		navigate({
			to: "/results/$attemptId",
			params: { attemptId }
		});
		return null;
	}
	if (!current || !data) return null;
	const fb = data.attempt.mode === "PRACTICE" ? feedback[current.id] : void 0;
	const progress = questions.length ? (index + 1) / questions.length * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg pb-24 md:pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 border-b border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: data.attempt.quizTitle
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium tabular-nums",
						children: [
							"Question ",
							index + 1,
							" / ",
							questions.length
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-xs text-muted sm:inline",
								"aria-live": "polite",
								children: saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : saveState === "error" ? "Unable to save" : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamTimer, { remaining: remaining ?? data.remainingSeconds }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "md:hidden",
								onClick: () => setNavOpen(true),
								"aria-label": "Open navigator",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: progress,
					className: "h-1.5 rounded-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1fr_240px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-card p-5 md:p-7",
					children: [
						current.instruction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm font-medium text-secondary",
							children: current.instruction
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "whitespace-pre-wrap font-serif text-lg leading-relaxed text-fg",
							children: current.stem
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionRenderer, {
								question: current,
								value: answers[current.id] ?? null,
								onChange: (next) => queueSave(current.id, next),
								disabled: data.attempt.status !== "IN_PROGRESS",
								reveal: fb ? {
									correct: fb.correct,
									correctAnswer: fb.correctAnswer
								} : null
							})
						}),
						fb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackBanner, {
								correct: fb.correct,
								explanation: fb.explanation,
								correctAnswer: fb.correctAnswer
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 hidden items-center justify-between gap-3 md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									disabled: index === 0 || !data.allowBack,
									onClick: () => setIndex((i) => i - 1),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Back"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: marked[current.id] ? "secondary" : "outline",
									onClick: () => void toggleMark(),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }),
										" ",
										marked[current.id] ? "Marked" : "Mark for review"
									]
								}),
								index < questions.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
										persist(current.id, answers[current.id] ?? null);
										setIndex((i) => i + 1);
									},
									children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => setConfirm(true),
									children: "Submit"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-24 rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-xs font-medium uppercase tracking-wide text-muted",
								children: "Navigator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionNavigator, {
								items: questions.map((q) => ({
									id: q.id,
									marked: Boolean(marked[q.id]),
									answered: isAnswered(q.type, answers[q.id])
								})),
								currentIndex: index,
								onSelect: setIndex
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full",
								variant: "secondary",
								onClick: () => setConfirm(true),
								children: "Submit exam"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card p-3 md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: index === 0 || !data.allowBack,
							onClick: () => setIndex((i) => i - 1),
							children: "Back"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => void toggleMark(),
							children: marked[current.id] ? "Unmark" : "Mark"
						}),
						index < questions.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								persist(current.id, answers[current.id] ?? null);
								setIndex((i) => i + 1);
							},
							children: "Next"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => setConfirm(true),
							children: "Submit"
						})
					]
				})
			}),
			navOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-fg/40 md:hidden",
				role: "dialog",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 rounded-t-xl bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Questions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setNavOpen(false),
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionNavigator, {
						items: questions.map((q) => ({
							id: q.id,
							marked: Boolean(marked[q.id]),
							answered: isAnswered(q.type, answers[q.id])
						})),
						currentIndex: index,
						onSelect: (i) => {
							setIndex(i);
							setNavOpen(false);
						}
					})]
				})
			}) : null,
			confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-fg/40 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-xl border border-border bg-card p-6",
					role: "dialog",
					"aria-labelledby": "submit-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "submit-title",
							className: "font-serif text-xl font-semibold",
							children: "Submit this exam?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-1 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Answered: ", answeredCount] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Unanswered: ", questions.length - answeredCount] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Marked: ", markedCount] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm",
							children: "Are you sure you want to submit? You cannot change answers afterward."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setConfirm(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: submitMut.isPending,
								onClick: () => {
									setSubmitting(true);
									persist(current.id, answers[current.id] ?? null).then(() => submitMut.mutate());
								},
								children: submitMut.isPending ? "Submitting…" : "Submit"
							})]
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { ExamPage as component };
