import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-DtDPPULZ.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-Bf_Tf0-W.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-11 px-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
			outline: "border border-border bg-card text-fg hover:bg-option",
			ghost: "text-fg hover:bg-option",
			danger: "bg-danger text-white hover:bg-danger/90",
			link: "text-secondary underline-offset-4 hover:underline h-auto min-h-0 px-0"
		},
		size: {
			default: "h-11",
			sm: "h-9 min-h-9 px-3 text-sm",
			lg: "h-12 px-5",
			icon: "h-11 w-11 px-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
