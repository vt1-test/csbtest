import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { l as APP_NAME } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-CfADEwDc.js
var import_jsx_runtime = require_jsx_runtime();
function Terms() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl font-semibold text-fg",
					children: "Terms of use"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4",
					children: [APP_NAME, " provides practice examinations for educational use. Do not use it to cheat on a live certification. Accounts, attempts, and results belong to the signed-in user. Administrators may review activity logs for integrity."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Terms as component };
