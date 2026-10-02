import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as requestPasswordReset } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { t as Label } from "./label-BBVN7q1t.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-Db0Zyywc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Forgot() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		try {
			const res = await requestPasswordReset({ data: { email } });
			setResult(res);
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-md px-4 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl font-semibold",
						children: "Reset password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Enter your email. If an account exists, a one-hour reset token is created."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "mt-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: pending,
							children: pending ? "Sending…" : "Send reset link"
						})]
					}),
					result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-lg border border-border bg-card p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "If that email is registered, a reset link is ready." }), result.resetPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2",
							children: [
								"Preview environments cannot send email, so your link is:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/reset-password",
									search: { token: result.resetPath.split("token=")[1] },
									className: "text-secondary underline",
									children: "Continue to reset"
								})
							]
						}) : null]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Forgot as component };
