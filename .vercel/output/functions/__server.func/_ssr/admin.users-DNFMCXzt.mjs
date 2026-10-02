import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as formatDateTime } from "./utils-DtDPPULZ.mjs";
import { d as adminListUsers, g as adminUpdateUser } from "./admin-2c96sBmI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-DNFMCXzt.js
var import_jsx_runtime = require_jsx_runtime();
function AdminUsers() {
	const list = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => adminListUsers()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-serif text-2xl font-semibold",
		children: "Users"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 overflow-x-auto rounded-xl border border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[900px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "border-b border-border text-xs uppercase text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"Name",
					"Email",
					"Role",
					"Registered",
					"Last login",
					"Attempts",
					"Avg",
					"Status",
					""
				].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-3 py-2 font-medium",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data ?? []).map((row) => {
				const r = row;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.full_name || "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.email || "—")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.role)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: formatDateTime(String(r.created_at))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: r.last_login_at ? formatDateTime(String(r.last_login_at)) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: String(r.attempt_count)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: r.avg_score == null ? "—" : `${Number(r.avg_score).toFixed(0)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: String(r.status)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-secondary",
								onClick: () => void adminUpdateUser({ data: {
									userId: String(r.user_id),
									role: r.role === "ADMIN" ? "USER" : "ADMIN"
								} }).then(() => list.refetch()),
								children: r.role === "ADMIN" ? "Make user" : "Make admin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "ml-3 text-muted",
								onClick: () => void adminUpdateUser({ data: {
									userId: String(r.user_id),
									status: r.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE"
								} }).then(() => list.refetch()),
								children: r.status === "ACTIVE" ? "Deactivate" : "Activate"
							})]
						})
					]
				}, String(r.user_id));
			}) })]
		})
	})] });
}
//#endregion
export { AdminUsers as component };
