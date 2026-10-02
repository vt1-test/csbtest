import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as formatDuration } from "./utils-DtDPPULZ.mjs";
import { t as adminAnalytics } from "./admin-2c96sBmI.mjs";
import { t as Card } from "./card-D98fSIK0.mjs";
import { c as ResponsiveContainer, i as XAxis, l as Tooltip, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart, u as Legend } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-BYYiqcH1.js
var import_jsx_runtime = require_jsx_runtime();
function Analytics() {
	const s = useQuery({
		queryKey: ["admin-analytics"],
		queryFn: () => adminAnalytics()
	}).data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl font-semibold",
			children: "Analytics"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6",
			children: [
				["Attempts", s?.attempts ?? 0],
				["Unique users", s?.uniqueUsers ?? 0],
				["Average", s?.averageScore == null ? "—" : `${s.averageScore.toFixed(1)}%`],
				["Median", s?.medianScore == null ? "—" : `${s.medianScore.toFixed(1)}%`],
				["Pass rate", s?.passRate == null ? "—" : `${Math.round(s.passRate * 100)}%`],
				["Avg time", s?.averageTime == null ? "—" : formatDuration(s.averageTime)]
			].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase text-muted",
					children: l
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-xl font-semibold tabular-nums",
					children: v
				})]
			}, String(l)))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Attempts over time"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: s?.byDay ?? [],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "day" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "attempts",
								fill: "#087CC1"
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "Performance by type"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: s?.byType ?? [],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "type" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "success",
								fill: "#10BFA3"
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-serif text-lg",
			children: "Most missed questions"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 divide-y divide-border rounded-xl border border-border bg-card",
			children: [(s?.missed ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-4 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-2",
					children: m.stem
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted",
					children: [
						"Success ",
						Math.round(m.success * 100),
						"% · ",
						m.correct,
						"/",
						m.attempts,
						" correct"
					]
				})]
			}, m.id)), (s?.missed ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "px-4 py-6 text-sm text-muted",
				children: "No scored attempts yet."
			}) : null]
		})
	] });
}
//#endregion
export { Analytics as component };
