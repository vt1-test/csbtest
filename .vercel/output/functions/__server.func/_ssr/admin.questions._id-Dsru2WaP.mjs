import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { o as nid } from "./utils-DtDPPULZ.mjs";
import { t as QUESTION_TYPES } from "./types-CfSM8BPy.mjs";
import { m as adminSaveQuestion, o as adminGetQuestion, r as adminDeleteQuestion } from "./admin-2c96sBmI.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { t as Textarea } from "./textarea-Blr3hhNY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DObgaAkn.mjs";
import { a as stripAnswerKey } from "./scoring-jGSfDrnQ.mjs";
import { t as Label } from "./label-BBVN7q1t.mjs";
import { t as QuestionRenderer } from "./question-renderer-96Awxkzp.mjs";
import { s as Route } from "./router-CCTAOH3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.questions._id-Dsru2WaP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuestionEditor() {
	const { id } = Route.useParams();
	const qc = useQueryClient();
	const data = useQuery({
		queryKey: ["admin-q", id],
		queryFn: () => adminGetQuestion({ data: { id } })
	});
	const [stem, setStem] = (0, import_react.useState)("");
	const [instruction, setInstruction] = (0, import_react.useState)("");
	const [explanation, setExplanation] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("SINGLE_CHOICE");
	const [payload, setPayload] = (0, import_react.useState)({});
	const [status, setStatus] = (0, import_react.useState)("published");
	const [needsReview, setNeedsReview] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!data.data) return;
		setStem(data.data.stem);
		setInstruction(data.data.instruction);
		setExplanation(data.data.explanation);
		setType(data.data.type);
		setPayload(data.data.payload);
		setStatus(data.data.status);
		setNeedsReview(data.data.needsReview);
	}, [data.data]);
	const save = useMutation({
		mutationFn: () => adminSaveQuestion({ data: {
			id,
			quizId: data.data.quizId,
			type,
			stem,
			instruction,
			explanation,
			payload,
			status,
			needsReview
		} }),
		onSuccess: () => {
			toast.success("Question saved");
			qc.invalidateQueries({ queryKey: ["admin-q", id] });
		}
	});
	if (!data.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Loading question…"
	});
	const exam = {
		id,
		type,
		stem,
		instruction,
		points: 1,
		requiredAnswers: data.data.requiredAnswers,
		...stripAnswerKey(type, payload)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl font-semibold",
					children: "Question editor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-md border border-border bg-card px-3 text-sm",
						value: type,
						onChange: (e) => setType(e.target.value),
						children: QUESTION_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stem" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: stem,
						onChange: (e) => setStem(e.target.value),
						className: "min-h-40"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Instruction" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: instruction,
						onChange: (e) => setInstruction(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayloadEditor, {
					type,
					payload,
					onChange: setPayload
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Explanation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: explanation,
						onChange: (e) => setExplanation(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: needsReview,
						onChange: (e) => setNeedsReview(e.target.checked)
					}), "Needs review"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => save.mutate(),
							disabled: save.isPending,
							children: "Save"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								setStatus("draft");
								save.mutate();
							},
							children: "Save draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => void adminDeleteQuestion({ data: { id } }).then(() => {
								toast.success("Deleted");
							}),
							children: "Delete"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-lg",
				children: "Preview as student"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs text-muted",
				children: "This preview does not create a real attempt."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm font-medium text-secondary",
						children: instruction
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 whitespace-pre-wrap font-serif",
						children: stem
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionRenderer, {
						question: exam,
						value: null,
						onChange: () => void 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/quizzes/$id",
					params: { id: data.data.quizId },
					className: "text-secondary",
					children: "Back to quiz"
				})
			})
		] })]
	});
}
function PayloadEditor({ type, payload, onChange }) {
	if ([
		"SINGLE_CHOICE",
		"MULTIPLE_CHOICE",
		"TRUE_FALSE",
		"YES_NO",
		"IMAGE_CHOICE"
	].includes(type)) {
		const options = payload.options ?? [];
		const correct = new Set(payload.correctOptionIds ?? []);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Options" }),
				options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: type === "MULTIPLE_CHOICE" ? "checkbox" : "radio",
							checked: correct.has(opt.id),
							onChange: () => {
								const next = type === "MULTIPLE_CHOICE" ? correct.has(opt.id) ? [...correct].filter((id) => id !== opt.id) : [...correct, opt.id] : [opt.id];
								onChange({
									...payload,
									correctOptionIds: next
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: opt.text,
							onChange: (e) => {
								const next = options.slice();
								next[i] = {
									...opt,
									text: e.target.value
								};
								onChange({
									...payload,
									options: next
								});
							}
						}),
						type === "IMAGE_CHOICE" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Image URL",
							value: opt.imageUrl ?? "",
							onChange: (e) => {
								const next = options.slice();
								next[i] = {
									...opt,
									imageUrl: e.target.value
								};
								onChange({
									...payload,
									options: next
								});
							}
						}) : null
					]
				}, opt.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => onChange({
						...payload,
						options: [...options, {
							id: nid("opt").slice(-6),
							text: "New option"
						}]
					}),
					children: "Add option"
				})
			]
		});
	}
	if (type === "MATCHING") {
		const sources = payload.sources ?? [];
		const targets = payload.targets ?? [];
		const pairs = payload.pairs ?? [];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sources" }),
					sources.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						value: s.text,
						onChange: (e) => {
							const next = sources.slice();
							next[i] = {
								...s,
								text: e.target.value
							};
							onChange({
								...payload,
								sources: next
							});
						}
					}, s.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						className: "mt-2",
						onClick: () => onChange({
							...payload,
							sources: [...sources, {
								id: nid("s").slice(-6),
								text: "New source"
							}]
						}),
						children: "Add source"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Targets" }),
					targets.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						value: s.text,
						onChange: (e) => {
							const next = targets.slice();
							next[i] = {
								...s,
								text: e.target.value
							};
							onChange({
								...payload,
								targets: next
							});
						}
					}, s.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						className: "mt-2",
						onClick: () => onChange({
							...payload,
							targets: [...targets, {
								id: nid("t").slice(-6),
								text: "New target"
							}]
						}),
						children: "Add target"
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Correct pairs" }), sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 flex items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-40 truncate",
					children: s.text
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "h-11 flex-1 rounded-md border border-border bg-card px-3",
					value: pairs.find((p) => p.sourceId === s.id)?.targetId ?? "",
					onChange: (e) => {
						const next = pairs.filter((p) => p.sourceId !== s.id);
						if (e.target.value) next.push({
							sourceId: s.id,
							targetId: e.target.value
						});
						onChange({
							...payload,
							pairs: next
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Unmatched"
					}), targets.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.text
					}, t.id))]
				})]
			}, s.id))] })]
		});
	}
	if (type === "ORDERING") {
		const orderItems = payload.orderItems ?? [];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Correct sequence" }),
			orderItems.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "mt-2",
				value: item.text,
				onChange: (e) => {
					const next = orderItems.slice();
					next[i] = {
						...item,
						text: e.target.value
					};
					onChange({
						...payload,
						orderItems: next
					});
				}
			}, item.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				className: "mt-2",
				onClick: () => onChange({
					...payload,
					orderItems: [...orderItems, {
						id: nid("o").slice(-6),
						text: "New item",
						correctPosition: orderItems.length + 1
					}]
				}),
				children: "Add item"
			})
		] });
	}
	if (type === "DROPDOWN") {
		const blanks = payload.blanks ?? [];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [blanks.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: b.prompt,
						onChange: (e) => {
							const next = blanks.slice();
							next[i] = {
								...b,
								prompt: e.target.value
							};
							onChange({
								...payload,
								blanks: next
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						value: b.choices.join(" | "),
						onChange: (e) => {
							const next = blanks.slice();
							next[i] = {
								...b,
								choices: e.target.value.split("|").map((x) => x.trim()).filter(Boolean)
							};
							onChange({
								...payload,
								blanks: next
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						value: b.correct,
						onChange: (e) => {
							const next = blanks.slice();
							next[i] = {
								...b,
								correct: e.target.value
							};
							onChange({
								...payload,
								blanks: next
							});
						}
					})
				]
			}, b.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => onChange({
					...payload,
					blanks: [...blanks, {
						id: nid("b").slice(-6),
						prompt: "New blank",
						choices: ["A", "B"],
						correct: "A"
					}]
				}),
				children: "Add blank"
			})]
		});
	}
	return null;
}
//#endregion
export { QuestionEditor as component };
