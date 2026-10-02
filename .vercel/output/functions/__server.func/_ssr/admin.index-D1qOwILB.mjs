import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { f as adminOverview } from "./admin-2c96sBmI.mjs";
import { t as Card } from "./card-D98fSIK0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-D1qOwILB.js
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const s = useQuery({
		queryKey: ["admin-overview"],
		queryFn: () => adminOverview()
	}).data;
	const items = [
		["Total users", s?.totalUsers ?? "—"],
		["Active users", s?.activeUsers ?? "—"],
		["Quizzes", s?.totalQuizzes ?? "—"],
		["Published", s?.publishedQuizzes ?? "—"],
		["Questions", s?.questions ?? "—"],
		["Attempts", s?.attempts ?? "—"],
		["Average score", s?.averageScore == null ? "—" : `${s.averageScore.toFixed(1)}%`],
		["Pass rate", s?.passRate == null ? "—" : `${Math.round(s.passRate * 100)}%`]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl font-semibold",
			children: "Admin overview"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Live totals from the database — not placeholders."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: items.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-serif text-2xl font-semibold tabular-nums",
					children: value
				})]
			}, String(label)))
		})
	] });
}
//#endregion
export { AdminHome as component };
