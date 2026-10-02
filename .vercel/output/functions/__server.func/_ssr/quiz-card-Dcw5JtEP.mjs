import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatDuration } from "./utils-DtDPPULZ.mjs";
import { t as Card } from "./card-D98fSIK0.mjs";
import { s as ListChecks, u as Clock } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-Dsc440nc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-card-Dcw5JtEP.js
var import_jsx_runtime = require_jsx_runtime();
function QuizCard({ quiz }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex h-full flex-col p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "info",
					children: quiz.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: quiz.difficulty })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-lg font-semibold text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/quizzes/$slug",
					params: { slug: quiz.slug },
					className: "hover:text-secondary",
					children: quiz.title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-3 flex-1 text-sm text-muted",
				children: quiz.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-4 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-3.5" }),
							" ",
							quiz.questionCount,
							" questions"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
							" ",
							formatDuration(quiz.timeLimitSeconds)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Pass ",
						quiz.passingPercentage,
						"%"
					] })
				]
			})
		]
	});
}
//#endregion
export { QuizCard as t };
