import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CWZoMa8v.mjs";
import { _n as object, bn as string, dn as boolean, fn as custom, un as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { l as adminListQuizzes } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Textarea } from "./textarea-Blr3hhNY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.import-CgQoTUDk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var parseDocxUpload = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	filename: string(),
	base64: string()
})).handler(createSsrRpc("df265b496c7d5e35dc66ea28f0c251cf836c7e01a6c3186768a3d3b34b0c4a03"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ jobId: string() })).handler(createSsrRpc("00be8be42c88d47996847fe186c5598efee13f48d173d83c4127f964bd1ac7c1"));
var saveImportRecords = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	jobId: string(),
	records: array(custom())
})).handler(createSsrRpc("101beb0b63b7491a8c51c8a0bba35f485e56c32080863d5c9480e3429cdef7f1"));
var commitImport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	jobId: string(),
	quizId: string(),
	onlyReady: boolean().default(false)
})).handler(createSsrRpc("10b5c305dcd9935a831db27706a65398c59114fd7086ca7f7dc74b713ec98312"));
function ImportPage() {
	const quizzes = useQuery({
		queryKey: ["admin-quizzes"],
		queryFn: () => adminListQuizzes({ data: {
			page: 1,
			pageSize: 100
		} })
	});
	const [jobId, setJobId] = (0, import_react.useState)(null);
	const [report, setReport] = (0, import_react.useState)(null);
	const [records, setRecords] = (0, import_react.useState)([]);
	const [quizId, setQuizId] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFile(file) {
		setBusy(true);
		try {
			const buf = await file.arrayBuffer();
			const bytes = new Uint8Array(buf);
			let binary = "";
			bytes.forEach((b) => {
				binary += String.fromCharCode(b);
			});
			const base64 = btoa(binary);
			const res = await parseDocxUpload({ data: {
				filename: file.name,
				base64
			} });
			setJobId(res.jobId);
			setReport(res.report);
			setRecords(res.records);
			toast.success(`Detected ${res.report.detected} questions`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Parse failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl font-semibold",
				children: "DOCX import"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Upload a mock-exam Word file. Detected questions are reviewed before they are written to a quiz. Ambiguous records stay in Needs review — nothing is silently discarded."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "mt-4 block text-sm",
				type: "file",
				accept: ".docx",
				disabled: busy,
				onChange: (e) => {
					const file = e.target.files?.[0];
					if (file) onFile(file);
				}
			}),
			report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-6",
				children: Object.entries(report).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-card p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs uppercase text-muted",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-semibold tabular-nums",
						children: v
					})]
				}, k))
			}) : null,
			records.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4",
				children: [records.map((rec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: rec.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rec.type })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-2 min-h-24",
							value: rec.stem,
							onChange: (e) => {
								const next = records.slice();
								next[i] = {
									...rec,
									stem: e.target.value
								};
								setRecords(next);
							}
						}),
						rec.reviewNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-warning",
							children: rec.reviewNote
						}) : null
					]
				}, rec.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
						value: quizId,
						onChange: (e) => setQuizId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Import into quiz…"
						}), (quizzes.data?.rows ?? []).map((r) => {
							const row = r;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: row.id,
								children: row.title
							}, row.id);
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !jobId || !quizId,
						onClick: () => {
							(async () => {
								await saveImportRecords({ data: {
									jobId,
									records
								} });
								const res = await commitImport({ data: {
									jobId,
									quizId,
									onlyReady: false
								} });
								toast.success(`Imported ${res.imported}, skipped ${res.skipped}`);
							})();
						},
						children: "Approve & import"
					})]
				})]
			}) : null
		]
	});
}
//#endregion
export { ImportPage as component };
