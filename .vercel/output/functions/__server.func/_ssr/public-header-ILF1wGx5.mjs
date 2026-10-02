import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as getMyProfile, h as useCurrentUserState, i as UserButton, n as SignedIn, r as SignedOut } from "./attempts-B_4CXuRN.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { l as APP_NAME } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-header-ILF1wGx5.js
var import_jsx_runtime = require_jsx_runtime();
function PublicHeader() {
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["me", user?.id],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground",
						children: "M"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-lg font-semibold tracking-tight text-fg",
						children: APP_NAME
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-6 text-sm font-medium text-muted sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/quizzes",
						className: "hover:text-fg",
						children: "Catalog"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "hover:text-fg",
						children: "Dashboard"
					}), profile.data?.role === "ADMIN" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "hover:text-fg",
						children: "Admin"
					}) : null] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-24 animate-pulse rounded-full bg-option" }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedOut, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Sign in"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signup",
								children: "Create account"
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) })
					]
				})
			]
		})
	});
}
function PublicFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [APP_NAME, " · Professional mock exams"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/terms",
					className: "hover:text-fg",
					children: "Terms"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/privacy",
					className: "hover:text-fg",
					children: "Privacy"
				})]
			})]
		})
	});
}
//#endregion
export { PublicHeader as n, PublicFooter as t };
