import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-DtDPPULZ.mjs";
import { f as CircleX, p as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/question-navigator-DdTt2ugK.js
var import_jsx_runtime = require_jsx_runtime();
function FeedbackBanner({ correct, explanation, correctAnswer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium", correct ? "border-success bg-success/10 text-success-fg" : "border-danger bg-danger/10 text-danger"),
				role: "status",
				children: [correct ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5" }), correct ? "Correct" : "Incorrect"]
			}),
			!correct && correctAnswer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Correct answer: "
				}), correctAnswer]
			}) : null,
			explanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-option px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-xs font-semibold uppercase tracking-wide text-muted",
					children: "Explanation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm leading-relaxed text-fg",
					children: explanation
				})]
			}) : null
		]
	});
}
function QuestionNavigator({ items, currentIndex, onSelect, review }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-7 gap-1.5",
		role: "navigation",
		"aria-label": "Question navigator",
		children: items.map((item, i) => {
			const current = i === currentIndex;
			let tone = "border-border bg-card text-muted";
			if (review && item.correct === true) tone = "border-success bg-success/15 text-success-fg";
			else if (review && item.correct === false) tone = "border-danger bg-danger/10 text-danger";
			else if (item.marked) tone = "border-warning bg-warning/15 text-warning";
			else if (item.answered) tone = "border-secondary/40 bg-secondary/10 text-secondary";
			if (current) tone += " ring-2 ring-secondary";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onSelect(i),
				className: cn("grid h-11 min-w-11 place-items-center rounded-md border text-sm font-medium tabular-nums", tone),
				"aria-current": current ? "step" : void 0,
				"aria-label": `Question ${i + 1}${item.answered ? ", answered" : ", unanswered"}${item.marked ? ", marked" : ""}`,
				children: i + 1
			}, item.id);
		})
	});
}
//#endregion
export { QuestionNavigator as n, FeedbackBanner as t };
