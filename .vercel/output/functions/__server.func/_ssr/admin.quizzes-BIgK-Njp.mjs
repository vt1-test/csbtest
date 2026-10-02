import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as adminSaveQuiz, l as adminListQuizzes, p as adminQuizAction } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { t as Badge } from "./badge-Dsc440nc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.quizzes-BIgK-Njp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminQuizzes() {
	const [q, setQ] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: ["admin-quizzes", q],
		queryFn: () => adminListQuizzes({ data: {
			q,
			page: 1
		} })
	});
	const navigate = useNavigate();
	async function create() {
		const res = await adminSaveQuiz({ data: {
			title: "Untitled quiz",
			description: "",
			instructions: "",
			category: "General",
			difficulty: "Intermediate",
			timeLimitSeconds: 1800,
			passingPercentage: 70,
			feedbackMode: "EXAM",
			showExplanation: true,
			showScoreImmediately: true,
			randomizeQuestions: false,
			randomizeOptions: true,
			allowBackNavigation: true,
			allowRetake: true,
			published: false,
			active: true
		} });
		navigate({
			to: "/admin/quizzes/$id",
			params: { id: res.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl font-semibold",
				children: "Quizzes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void create(),
				children: "Create quiz"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-4 max-w-sm",
			placeholder: "Search",
			value: q,
			onChange: (e) => setQ(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto rounded-xl border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[800px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-xs uppercase text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Title",
						"Category",
						"Questions",
						"Status",
						"Updated",
						""
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((row) => {
					const r = row;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/quizzes/$id",
									params: { id: String(r.id) },
									className: "font-medium hover:underline",
									children: String(r.title)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: String(r.category)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: String(r.question_count)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: r.published ? "success" : "neutral",
									children: r.published ? "Published" : "Draft"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-muted",
								children: String(r.updated_at).slice(0, 16)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "text-secondary",
										onClick: () => void adminQuizAction({ data: {
											id: String(r.id),
											action: r.published ? "unpublish" : "publish"
										} }).then(() => list.refetch()),
										children: r.published ? "Unpublish" : "Publish"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "text-muted",
										onClick: () => void adminQuizAction({ data: {
											id: String(r.id),
											action: "duplicate"
										} }).then(() => list.refetch()),
										children: "Duplicate"
									})]
								})
							})
						]
					}, String(r.id));
				}) })]
			})
		})
	] });
}
//#endregion
export { AdminQuizzes as component };
