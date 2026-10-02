import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { h as adminSaveQuiz, s as adminGetQuiz } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Textarea } from "./textarea-Blr3hhNY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { t as Label } from "./label-BBVN7q1t.mjs";
import { o as Route } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.quizzes._id-CBR9DnZ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuizEditor() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const data = useQuery({
		queryKey: ["admin-quiz", id],
		queryFn: () => adminGetQuiz({ data: { id } })
	});
	const [form, setForm] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (!data.data) return;
		const q = data.data.quiz;
		setForm({
			title: String(q.title),
			slug: String(q.slug),
			description: String(q.description),
			instructions: String(q.instructions),
			category: String(q.category),
			difficulty: String(q.difficulty),
			timeLimitSeconds: Number(q.time_limit_seconds),
			passingPercentage: Number(q.passing_percentage),
			feedbackMode: String(q.feedback_mode),
			published: Boolean(q.published),
			active: Boolean(q.active),
			randomizeQuestions: Boolean(q.randomize_questions),
			randomizeOptions: Boolean(q.randomize_options),
			allowBackNavigation: Boolean(q.allow_back_navigation),
			allowRetake: Boolean(q.allow_retake),
			maxAttempts: q.max_attempts == null ? "" : Number(q.max_attempts)
		});
	}, [data.data]);
	const save = useMutation({
		mutationFn: () => adminSaveQuiz({ data: {
			id,
			title: String(form.title),
			slug: String(form.slug),
			description: String(form.description ?? ""),
			instructions: String(form.instructions ?? ""),
			category: String(form.category),
			difficulty: String(form.difficulty),
			timeLimitSeconds: Number(form.timeLimitSeconds),
			passingPercentage: Number(form.passingPercentage),
			feedbackMode: form.feedbackMode === "PRACTICE" ? "PRACTICE" : "EXAM",
			published: Boolean(form.published),
			active: Boolean(form.active),
			randomizeQuestions: Boolean(form.randomizeQuestions),
			randomizeOptions: Boolean(form.randomizeOptions),
			allowBackNavigation: Boolean(form.allowBackNavigation),
			allowRetake: Boolean(form.allowRetake),
			maxAttempts: form.maxAttempts === "" || form.maxAttempts == null ? null : Number(form.maxAttempts),
			showExplanation: true,
			showScoreImmediately: true
		} }),
		onSuccess: () => {
			toast.success("Quiz saved");
			qc.invalidateQueries({ queryKey: ["admin-quiz", id] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	if (!data.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading editor…"
	});
	const questions = data.data.questions;
	function field(key, label, type = "text", options) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: String(form[key] ?? ""),
				onChange: (e) => setForm((f) => ({
					...f,
					[key]: e.target.value
				}))
			}) : type === "checkbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: Boolean(form[key]),
				onChange: (e) => setForm((f) => ({
					...f,
					[key]: e.target.checked
				}))
			}) : type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: "h-11 w-full rounded-md border border-border bg-card px-3 text-sm",
				value: String(form[key]),
				onChange: (e) => setForm((f) => ({
					...f,
					[key]: e.target.value
				})),
				children: options?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: o }, o))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type,
				value: String(form[key] ?? ""),
				onChange: (e) => setForm((f) => ({
					...f,
					[key]: type === "number" ? Number(e.target.value) : e.target.value
				}))
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl font-semibold",
				children: "Edit quiz"
			}),
			field("title", "Title"),
			field("slug", "Slug"),
			field("description", "Description", "textarea"),
			field("instructions", "Instructions", "textarea"),
			field("category", "Category"),
			field("difficulty", "Difficulty", "select", [
				"Beginner",
				"Intermediate",
				"Advanced"
			]),
			field("timeLimitSeconds", "Duration (seconds)", "number"),
			field("passingPercentage", "Passing %", "number"),
			field("feedbackMode", "Default mode", "select", ["EXAM", "PRACTICE"]),
			field("maxAttempts", "Max attempts (blank = unlimited)"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					"published",
					"active",
					"randomizeQuestions",
					"randomizeOptions",
					"allowBackNavigation",
					"allowRetake"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: Boolean(form[k]),
						onChange: (e) => setForm((f) => ({
							...f,
							[k]: e.target.checked
						}))
					}), k]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => save.mutate(),
					disabled: save.isPending,
					children: save.isPending ? "Saving…" : "Save"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/quizzes/$slug",
						params: { slug: String(form.slug || "") },
						children: "Preview as student"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "pt-6 font-serif text-xl",
				children: [
					"Questions (",
					questions.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl border border-border bg-card",
				children: questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "line-clamp-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mr-2 text-muted",
							children: [q.position, "."]
						}), q.stem.slice(0, 140)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "shrink-0 text-secondary",
						to: "/admin/questions/$id",
						params: { id: q.id },
						children: "Edit"
					})]
				}, q.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/questions",
					search: { quizId: id },
					children: "Manage questions"
				})
			})
		]
	});
}
//#endregion
export { QuizEditor as component };
