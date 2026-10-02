import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { C as useRouter, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { _n as object, bn as string, gn as number, mn as literal, xn as union } from "../_libs/@better-auth/core+[...].mjs";
import { t as auth } from "./server-DI7y87Ws.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/config-Qz9fY7gD.js
var APP_NAME = "Meridian";
var APP_TAGLINE = "Professional mock exams";
var APP_DESCRIPTION = "Timed certification practice, scored attempts, and detailed answer review — built for serious exam prep.";
var THEME_COLOR = "#10BFA3";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/admin.questions-DANTb0uG.js
var $$splitComponentImporter$22 = () => import("./admin.questions-DJMDkqT0.mjs");
var Route$24 = createFileRoute("/admin/questions")({
	validateSearch: (s) => ({ quizId: typeof s.quizId === "string" ? s.quizId : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/admin.questions._id-Yhhasute.js
var $$splitComponentImporter$21 = () => import("./admin.questions._id-Dsru2WaP.mjs");
var Route$23 = createFileRoute("/admin/questions/$id")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/admin.quizzes._id-G3AGtnf8.js
var $$splitComponentImporter$20 = () => import("./admin.quizzes._id-CBR9DnZ9.mjs");
var Route$22 = createFileRoute("/admin/quizzes/$id")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/exam._attemptId-Ys1FAc79.js
var $$splitComponentImporter$19 = () => import("./exam._attemptId-COhfZTmj.mjs");
var Route$21 = createFileRoute("/exam/$attemptId")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/quizzes._slug-BGfaTksm.js
var $$splitComponentImporter$18 = () => import("./quizzes._slug-BOuCZd3k.mjs");
var Route$20 = createFileRoute("/quizzes/$slug")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-CKlCu-rJ.js
var $$splitComponentImporter$17 = () => import("./reset-password-BycdijFy.mjs");
var Route$19 = createFileRoute("/reset-password")({
	validateSearch: (s) => ({ token: typeof s.token === "string" ? s.token : "" }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/results._attemptId-BGtE4ICI.js
var $$splitComponentImporter$16 = () => import("./results._attemptId-Br7LMJr3.mjs");
var Route$18 = createFileRoute("/results/$attemptId")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CCTAOH3c.js
var router_CCTAOH3c_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-CqwQJl0L.css";
var Route$17 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: APP_DESCRIPTION
			},
			{
				name: "theme-color",
				content: THEME_COLOR
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Serif:wght@500;600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 15e3,
		retry: 1,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
				client,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					richColors: true
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$15 = () => import("./routes-BMNGgGnk.mjs");
var Route$16 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin-BwCh_IPJ.mjs");
var Route$15 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./dashboard-D2qkjM66.mjs");
var Route$14 = createFileRoute("/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./forgot-password-Db0Zyywc.mjs");
var Route$13 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./login-CwDjLS69.mjs");
var Route$12 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./privacy-CegvK7Oa.mjs");
var Route$11 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./signup-CDL45I5a.mjs");
var Route$10 = createFileRoute("/signup")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./terms-CfADEwDc.mjs");
var Route$9 = createFileRoute("/terms")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.index-D1qOwILB.mjs");
var Route$8 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.analytics-BYYiqcH1.mjs");
var Route$7 = createFileRoute("/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.import-CgQoTUDk.mjs");
var Route$6 = createFileRoute("/admin/import")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.quizzes-BIgK-Njp.mjs");
var Route$5 = createFileRoute("/admin/quizzes")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.results-qHII0R0s.mjs");
var Route$4 = createFileRoute("/admin/results")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.settings-BpRKrJJ6.mjs");
var Route$3 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.users-DNFMCXzt.mjs");
var Route$2 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./quizzes.index-CsQfssj7.mjs");
var Route$1 = createFileRoute("/quizzes/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$17
});
var AdminRoute = Route$15.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$17
});
var DashboardRoute = Route$14.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$17
});
var ForgotPasswordRoute = Route$13.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$17
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$17
});
var PrivacyRoute = Route$11.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$17
});
var ResetPasswordRoute = Route$19.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$17
});
var SignupRoute = Route$10.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$17
});
var TermsRoute = Route$9.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$17
});
var AdminIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAnalyticsRoute = Route$7.update({
	id: "/analytics",
	path: "/analytics",
	getParentRoute: () => AdminRoute
});
var AdminImportRoute = Route$6.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => AdminRoute
});
var AdminQuestionsRoute = Route$24.update({
	id: "/questions",
	path: "/questions",
	getParentRoute: () => AdminRoute
});
var AdminQuizzesRoute = Route$5.update({
	id: "/quizzes",
	path: "/quizzes",
	getParentRoute: () => AdminRoute
});
var AdminResultsRoute = Route$4.update({
	id: "/results",
	path: "/results",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminUsersRoute = Route$2.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var ExamAttemptIdRoute = Route$21.update({
	id: "/exam/$attemptId",
	path: "/exam/$attemptId",
	getParentRoute: () => Route$17
});
var QuizzesIndexRoute = Route$1.update({
	id: "/quizzes/",
	path: "/quizzes/",
	getParentRoute: () => Route$17
});
var QuizzesSlugRoute = Route$20.update({
	id: "/quizzes/$slug",
	path: "/quizzes/$slug",
	getParentRoute: () => Route$17
});
var ResultsAttemptIdRoute = Route$18.update({
	id: "/results/$attemptId",
	path: "/results/$attemptId",
	getParentRoute: () => Route$17
});
var AdminQuestionsIdRoute = Route$23.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminQuestionsRoute
});
var AdminQuizzesIdRoute = Route$22.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminQuizzesRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$17
});
var AdminQuestionsRouteChildren = { AdminQuestionsIdRoute };
var AdminQuestionsRouteWithChildren = AdminQuestionsRoute._addFileChildren(AdminQuestionsRouteChildren);
var AdminQuizzesRouteChildren = { AdminQuizzesIdRoute };
var AdminRouteChildren = {
	AdminAnalyticsRoute,
	AdminImportRoute,
	AdminQuestionsRoute: AdminQuestionsRouteWithChildren,
	AdminQuizzesRoute: AdminQuizzesRoute._addFileChildren(AdminQuizzesRouteChildren),
	AdminResultsRoute,
	AdminSettingsRoute,
	AdminUsersRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	DashboardRoute,
	ForgotPasswordRoute,
	LoginRoute,
	PrivacyRoute,
	ResetPasswordRoute,
	SignupRoute,
	TermsRoute,
	ExamAttemptIdRoute,
	QuizzesSlugRoute,
	ResultsAttemptIdRoute,
	QuizzesIndexRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$21 as a, Route$24 as c, getRouter, Route$20 as i, APP_NAME as l, Route$18 as n, Route$22 as o, Route$19 as r, Route$23 as s, router_CCTAOH3c_exports as t, APP_TAGLINE as u };
