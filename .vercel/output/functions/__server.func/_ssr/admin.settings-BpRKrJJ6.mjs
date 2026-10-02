import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatDateTime } from "./utils-DtDPPULZ.mjs";
import { i as adminExportQuestionsJson, n as adminAuditLog } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-BpRKrJJ6.js
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const log = useQuery({
		queryKey: ["audit"],
		queryFn: () => adminAuditLog()
	});
	async function exportJson() {
		const res = await adminExportQuestionsJson({ data: {} });
		const blob = new Blob([JSON.stringify(res.questions, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "question-bank.json";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl font-semibold",
			children: "Settings"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Brand, export, and audit trail."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => void exportJson(),
				children: "Export question bank JSON"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-serif text-lg",
			children: "Audit log"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card text-sm",
			children: [(log.data ?? []).map((row) => {
				const r = row;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: String(r.action)
						}),
						" · ",
						String(r.entity_type),
						" ",
						String(r.entity_id ?? "")
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							formatDateTime(String(r.created_at)),
							" · actor ",
							String(r.actor_id ?? "system")
						]
					})]
				}, String(r.id));
			}), (log.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-6 text-muted",
				children: "No admin actions recorded yet."
			}) : null]
		})
	] });
}
//#endregion
export { Settings as component };
