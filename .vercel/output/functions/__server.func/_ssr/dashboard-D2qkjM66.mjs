import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatDateTime, r as formatDuration } from "./utils-DtDPPULZ.mjs";
import { h as useCurrentUserState, o as getDashboardStats, t as RedirectToSignIn } from "./attempts-B_4CXuRN.mjs";
import { t as Card } from "./card-D98fSIK0.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, r as YAxis } from "../_libs/recharts+[...].mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { n as listPublishedQuizzes } from "./public-D47-UuFG.mjs";
import { t as QuizCard } from "./quiz-card-Dcw5JtEP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-D2qkjM66.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user, isPending } = useCurrentUserState();
	const stats = useQuery({
		queryKey: ["dashboard", user?.id],
		queryFn: () => getDashboardStats(),
		enabled: Boolean(user)
	});
	const quizzes = useQuery({
		queryKey: ["quizzes"],
		queryFn: () => listPublishedQuizzes()
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-6xl px-4 py-16 text-sm text-muted",
			children: "Loading dashboard…"
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const s = stats.data;
	const chart = (s?.recent ?? []).filter((a) => a.percentage != null).slice().reverse().map((a, i) => ({
		i: i + 1,
		score: a.percentage,
		name: a.quizTitle
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl font-semibold",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"Welcome back",
							user.displayName ? `, ${user.displayName}` : "",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
						children: [
							["Quizzes taken", s?.quizzesTaken ?? 0],
							["Attempts", s?.attempts ?? 0],
							["Average", s?.averageScore == null ? "—" : `${s.averageScore.toFixed(0)}%`],
							["Best", s?.bestScore == null ? "—" : `${s.bestScore.toFixed(0)}%`],
							["Pass rate", s?.passRate == null ? "—" : `${Math.round(s.passRate * 100)}%`]
						].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-serif text-2xl font-semibold tabular-nums",
								children: value
							})]
						}, String(label)))
					}),
					chart.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "mt-6 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: "Score history"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: chart,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "i" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { domain: [0, 100] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "score",
											stroke: "var(--color-secondary)",
											strokeWidth: 2,
											dot: true
										})
									]
								})
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-10 font-serif text-xl font-semibold",
						children: "Recent attempts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto rounded-xl border border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[720px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-xs uppercase text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
									"Quiz",
									"Attempt",
									"Date",
									"Score",
									"Time",
									"Result",
									""
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: h
								}, h)) })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(s?.recent ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: a.quizTitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 tabular-nums",
										children: a.attemptNumber
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: formatDateTime(a.startedAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 tabular-nums",
										children: a.percentage == null ? "In progress" : `${a.percentage}%`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 tabular-nums",
										children: a.timeUsedSeconds == null ? "—" : formatDuration(a.timeUsedSeconds)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: a.status === "IN_PROGRESS" ? "In progress" : a.passed ? "Pass" : "Fail"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: a.status === "IN_PROGRESS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											className: "text-secondary hover:underline",
											to: "/exam/$attemptId",
											params: { attemptId: a.id },
											children: "Resume"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											className: "text-secondary hover:underline",
											to: "/results/$attemptId",
											params: { attemptId: a.id },
											children: "Review"
										})
									})
								]
							}, a.id)), (s?.recent ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-6 text-muted",
								colSpan: 7,
								children: "No attempts yet. Start a quiz from the catalog."
							}) }) : null] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-10 font-serif text-xl font-semibold",
						children: "Available quizzes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-4 md:grid-cols-2",
						children: (quizzes.data ?? []).map((quiz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizCard, { quiz }, quiz.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Dashboard as component };
