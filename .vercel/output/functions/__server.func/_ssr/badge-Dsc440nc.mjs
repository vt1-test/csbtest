import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-DtDPPULZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Dsc440nc.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			neutral: "bg-option text-fg",
			success: "bg-success/15 text-success-fg",
			danger: "bg-danger/10 text-danger",
			warning: "bg-warning/15 text-warning",
			info: "bg-secondary/10 text-secondary"
		}[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
