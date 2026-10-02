import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { n as listPublishedQuizzes } from "./public-D47-UuFG.mjs";
import { t as QuizCard } from "./quiz-card-Dcw5JtEP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quizzes.index-CsQfssj7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Catalog() {
	const quizzes = useQuery({
		queryKey: ["quizzes"],
		queryFn: () => listPublishedQuizzes()
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [difficulty, setDifficulty] = (0, import_react.useState)("all");
	const items = quizzes.data ?? [];
	const categories = (0, import_react.useMemo)(() => Array.from(new Set(items.map((i) => i.category))), [items]);
	const filtered = items.filter((i) => {
		if (category !== "all" && i.category !== category) return false;
		if (difficulty !== "all" && i.difficulty !== difficulty) return false;
		if (q && !`${i.title} ${i.description}`.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl font-semibold",
						children: "Exam catalog"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Published mock exams available to registered candidates."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search exams",
								value: q,
								onChange: (e) => setQ(e.target.value),
								className: "md:col-span-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
								value: category,
								onChange: (e) => setCategory(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All categories"
								}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
								value: difficulty,
								onChange: (e) => setDifficulty(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All difficulties"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Beginner" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Intermediate" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Advanced" })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-4 md:grid-cols-2",
						children: [filtered.map((quiz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizCard, { quiz }, quiz.id)), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No published exams match those filters."
						}) : null]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Catalog as component };
