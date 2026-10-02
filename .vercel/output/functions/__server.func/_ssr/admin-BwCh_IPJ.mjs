import { b as Link, g as Outlet, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-DtDPPULZ.mjs";
import { c as getMyProfile, h as useCurrentUserState, t as RedirectToSignIn } from "./attempts-B_4CXuRN.mjs";
import { l as APP_NAME } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BwCh_IPJ.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/admin",
		label: "Overview",
		exact: true
	},
	{
		to: "/admin/quizzes",
		label: "Quizzes",
		exact: false
	},
	{
		to: "/admin/questions",
		label: "Questions",
		exact: false
	},
	{
		to: "/admin/import",
		label: "Import",
		exact: false
	},
	{
		to: "/admin/users",
		label: "Users",
		exact: false
	},
	{
		to: "/admin/results",
		label: "Results",
		exact: false
	},
	{
		to: "/admin/analytics",
		label: "Analytics",
		exact: false
	},
	{
		to: "/admin/settings",
		label: "Settings",
		exact: false
	}
];
function AdminLayout() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["me", user?.id],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted",
		children: "Loading…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (profile.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-sm text-muted",
		children: "Checking access…"
	});
	if (profile.data?.role !== "ADMIN") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl",
				children: "Admin only"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Your account does not have administrator permission."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dashboard",
				className: "mt-4 inline-block text-secondary hover:underline",
				children: "Return to dashboard"
			})
		] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg md:grid md:grid-cols-[220px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "border-b border-border bg-card md:min-h-screen md:border-b-0 md:border-r",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-serif text-lg font-semibold",
					children: APP_NAME
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Administration"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible",
				children: LINKS.map((l) => {
					const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: cn("rounded-md px-3 py-2 text-sm whitespace-nowrap", active ? "bg-option font-medium text-fg" : "text-muted hover:text-fg"),
						children: l.label
					}, l.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "flex h-14 items-center justify-end border-b border-border bg-card px-4 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					className: "text-muted hover:text-fg",
					children: "Exit admin"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 md:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
//#endregion
export { AdminLayout as component };
