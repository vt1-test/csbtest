import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatDateTime, r as formatDuration } from "./utils-DtDPPULZ.mjs";
import { a as adminExportResultsCsv, u as adminListResults } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.results-qHII0R0s.js
var import_jsx_runtime = require_jsx_runtime();
function AdminResults() {
	const list = useQuery({
		queryKey: ["admin-results"],
		queryFn: () => adminListResults({ data: { page: 1 } })
	});
	async function exportCsv() {
		const { csv } = await adminExportResultsCsv();
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "results.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl font-semibold",
			children: "Results"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => void exportCsv(),
			children: "Export CSV"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 overflow-x-auto rounded-xl border border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[1000px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-xs uppercase text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"User",
					"Quiz",
					"#",
					"Score",
					"%",
					"Correct",
					"Time",
					"Submitted",
					"Status"
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
							children: String(r.user_name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.quiz_title)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.attempt_number)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.score ?? "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: r.percentage == null ? "—" : `${Number(r.percentage).toFixed(0)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.correct_count ?? "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: r.time_used_seconds ? formatDuration(Number(r.time_used_seconds)) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: r.submitted_at ? formatDateTime(String(r.submitted_at)) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.status)
						})
					]
				}, String(r.id));
			}) })]
		})
	})] });
}
//#endregion
export { AdminResults as component };
