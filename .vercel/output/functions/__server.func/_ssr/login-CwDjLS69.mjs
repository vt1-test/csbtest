import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { i as GROK_PROVIDERS } from "./server-DI7y87Ws.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { t as Label } from "./label-BBVN7q1t.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { l as APP_NAME } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CwDjLS69.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setPending(true);
		try {
			const { error: err } = await authClient.signIn.email({
				email,
				password,
				rememberMe: remember
			});
			if (err) throw new Error(err.message ?? "Sign in failed");
			navigate({ to: "/dashboard" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign in failed");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-md px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl font-semibold",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Use your ",
							APP_NAME,
							" account to resume attempts and view results."
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									autoComplete: "email"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: show ? "text" : "password",
										required: true,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										autoComplete: "current-password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted",
										onClick: () => setShow((s) => !s),
										children: show ? "Hide" : "Show"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: remember,
									onChange: (e) => setRemember(e.target.checked),
									className: "size-4"
								}), "Remember me"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: pending,
								children: pending ? "Signing in…" : "Sign in"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/forgot-password",
							className: "text-secondary hover:underline",
							children: "Forgot password?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs uppercase tracking-wide text-muted",
							children: "Or continue with"
						}), GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "w-full",
							onClick: () => signIn(p.providerId, { callbackURL: "/dashboard" }),
							children: ["Continue with ", p.label]
						}, p.providerId))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-sm text-muted",
						children: [
							"No account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/signup",
								className: "font-medium text-secondary hover:underline",
								children: "Create one"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Login as component };
