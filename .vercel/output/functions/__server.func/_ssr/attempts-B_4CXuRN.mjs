import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CWZoMa8v.mjs";
import { _n as object, bn as string, cn as _enum, dn as boolean, un as array, xn as union, yn as record } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as hasGateSessionMarker } from "./server-DI7y87Ws.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attempts-B_4CXuRN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var answerSchema = union([
	object({ optionId: string() }),
	object({ optionIds: array(string()) }),
	object({ pairs: record(string(), string()) }),
	object({ itemIds: array(string()) }),
	object({ blanks: record(string(), string()) })
]);
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9f3067a4e371e0c5b539c831c7df442b19e0703dde5948a5662f0d8d516ebc91"));
var startAttempt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	quizId: string(),
	mode: _enum(["PRACTICE", "EXAM"])
})).handler(createSsrRpc("382890b1f549062d161ffe2f12bb26cac58f206309aaed302027293f1997cd35"));
var getExamState = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(createSsrRpc("84cd7385becc90b358ce1b698e30c794f3cf6430105e5772d9813ffc4f6290aa"));
var saveAnswer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	attemptId: string(),
	questionId: string(),
	answer: answerSchema.nullable()
})).handler(createSsrRpc("68886a29f24401c8ab0afacdb47dcffe75e7e1a25b09358856cd1d6c556f92f7"));
var markQuestion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	attemptId: string(),
	questionId: string(),
	marked: boolean()
})).handler(createSsrRpc("88c79977d75b92341928eeea3ffc3c8de69ff4705d0e29924b45aba8419ff3fb"));
var submitAttempt = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(createSsrRpc("6ae87ae7903c1a6ee5e45bc7e3f1d3cc28fcf8b80b99dac91dec4c1fd3590e76"));
var heartbeatAttempt = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(createSsrRpc("7935b2451894c355264a386af1d2392f65c19ca60efdedf60a5a6c3865cbe16a"));
var getAttemptResult = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ attemptId: string() })).handler(createSsrRpc("681b4a61b7af69e74c1f3cc4f64ee70585292949112454e52a2c06d7074ba16d"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1bec9611167beae43e28d5d09623a3459d322237299d59f52d9380f4501b93c9"));
var getDashboardStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9d53424e7f0b29f9e7894407a1b38c017c3226b80956af4e5db7cd1faf8a0a83"));
var getMyQuizProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ quizId: string() })).handler(createSsrRpc("205adfff2c3880e501d12db6c7e50b1d4b7cbe41b351fa07f11b4181b44c8e0f"));
//#endregion
export { getAttemptResult as a, getMyProfile as c, markQuestion as d, saveAnswer as f, useCurrentUserState as h, UserButton as i, getMyQuizProgress as l, submitAttempt as m, SignedIn as n, getDashboardStats as o, startAttempt as p, SignedOut as r, getExamState as s, RedirectToSignIn as t, heartbeatAttempt as u };
