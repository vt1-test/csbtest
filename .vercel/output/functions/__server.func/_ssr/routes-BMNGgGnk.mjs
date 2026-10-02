import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { b as ArrowRight, o as ShieldCheck, r as TimerReset, u as Clock } from "../_libs/lucide-react.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { n as listPublishedQuizzes } from "./public-D47-UuFG.mjs";
import { t as QuizCard } from "./quiz-card-Dcw5JtEP.mjs";
import { u as APP_TAGLINE } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BMNGgGnk.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const featured = useQuery({
		queryKey: ["quizzes"],
		queryFn: () => listPublishedQuizzes()
	}).data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-b border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium uppercase tracking-[0.14em] text-secondary",
								children: APP_TAGLINE
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-serif text-4xl font-semibold tracking-tight text-fg md:text-5xl",
								children: "Sit a mock exam the way you will sit the real one."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xl text-base leading-relaxed text-muted",
								children: "Timed attempts, autosaved answers, and scored review — including matching, ordering, dropdown, and image questions from professional certification banks."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/quizzes",
										children: ["Browse exams ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/signup",
										children: "Create a free account"
									})
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-bg p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted",
								children: "Live exam chrome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-lg border border-border bg-card p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "Question 11 / 41"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-secondary",
											children: "24:35"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 h-2 overflow-hidden rounded-full bg-option",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-2/3 bg-primary" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 space-y-2",
										children: [
											"Table",
											"Bar Chart",
											"Line Chart",
											"Pie Chart"
										].map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `rounded-md border px-3 py-2 text-sm ${i === 3 ? "border-secondary bg-secondary/10" : "border-border bg-option"}`,
											children: label
										}, label))
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-6xl px-4 py-14",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 md:grid-cols-3",
						children: [
							{
								icon: TimerReset,
								title: "Authoritative timer",
								body: "Server time is the source of truth. Refreshing the page never resets the clock."
							},
							{
								icon: ShieldCheck,
								title: "Secure scoring",
								body: "Answer keys stay on the server. Practice feedback is per-question; exams score on submit."
							},
							{
								icon: Clock,
								title: "Persistent attempts",
								body: "Answers autosave as you work. Resume the same attempt with the same order and marks."
							}
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-secondary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-3 font-serif text-lg font-semibold",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: item.body
								})
							]
						}, item.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-4 pb-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-end justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-semibold",
							children: "Featured exams"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Published banks available to signed-in candidates."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/quizzes",
							className: "text-sm font-medium text-secondary hover:underline",
							children: "View catalog"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: featured.map((quiz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizCard, { quiz }, quiz.id))
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Home as component };
