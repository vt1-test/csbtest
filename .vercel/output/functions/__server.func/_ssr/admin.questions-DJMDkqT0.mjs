import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as QUESTION_TYPES } from "./types-CfSM8BPy.mjs";
import { c as adminListQuestions, l as adminListQuizzes, m as adminSaveQuestion } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { c as Route } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.questions-DJMDkqT0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminQuestions() {
	const search = Route.useSearch();
	const [q, setQ] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: [
			"admin-questions",
			search.quizId,
			q,
			type
		],
		queryFn: () => adminListQuestions({ data: {
			quizId: search.quizId,
			q,
			type: type || void 0,
			page: 1
		} })
	});
	const quizzes = useQuery({
		queryKey: ["admin-quizzes"],
		queryFn: () => adminListQuizzes({ data: {
			page: 1,
			pageSize: 100
		} })
	});
	const navigate = useNavigate();
	async function create() {
		const quizId = search.quizId || String((quizzes.data?.rows?.[0])?.id || "");
		if (!quizId) return;
		const res = await adminSaveQuestion({ data: {
			quizId,
			type: "SINGLE_CHOICE",
			stem: "New question",
			instruction: "Choose one.",
			explanation: "",
			payload: {
				options: [{
					id: "a",
					text: "Option A"
				}, {
					id: "b",
					text: "Option B"
				}],
				correctOptionIds: ["a"]
			},
			status: "draft"
		} });
		navigate({
			to: "/admin/questions/$id",
			params: { id: res.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl font-semibold",
				children: "Questions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => void create(),
				children: "Create question"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search stem",
				value: q,
				onChange: (e) => setQ(e.target.value),
				className: "max-w-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
				value: type,
				onChange: (e) => setType(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All types"
				}), QUESTION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-x-auto rounded-xl border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-border text-xs uppercase text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Quiz",
						"Type",
						"Preview",
						"Status",
						"Review",
						""
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-3 py-2 font-medium",
						children: h
					}, h)) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data?.rows ?? []).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: row.quizTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: row.type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 max-w-md truncate",
							children: row.stem
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: row.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: row.needsReview ? "Needs review" : "Ready"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/questions/$id",
								params: { id: row.id },
								className: "text-secondary",
								children: "Edit"
							})
						})
					]
				}, row.id)) })]
			})
		})
	] });
}
//#endregion
export { AdminQuestions as component };
