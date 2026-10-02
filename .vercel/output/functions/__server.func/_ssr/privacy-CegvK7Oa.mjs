import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-ILF1wGx5.mjs";
import { l as APP_NAME } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-CegvK7Oa.js
var import_jsx_runtime = require_jsx_runtime();
function Privacy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl font-semibold text-fg",
					children: "Privacy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4",
					children: [APP_NAME, " stores your name, email, exam answers, and scores to operate the service. Passwords are hashed. We do not sell personal data. You may request account deactivation from an administrator."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Privacy as component };
