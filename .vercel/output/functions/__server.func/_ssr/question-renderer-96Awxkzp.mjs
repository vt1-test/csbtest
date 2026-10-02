import { o as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as closestCenter, h as CSS, i as PointerSensor, m as useSensors, p as useSensor, r as KeyboardSensor, t as DndContext } from "../_libs/@dnd-kit/core+[...].mjs";
import { t as cn } from "./utils-DtDPPULZ.mjs";
import { t as Button } from "./button-Bf_Tf0-W.mjs";
import { _ as ChevronDown, a as SquareCheck, d as Circle, f as CircleX, i as Square, l as GripVertical, m as ChevronUp, p as CircleCheck, v as Check } from "../_libs/lucide-react.mjs";
import { a as verticalListSortingStrategy, i as useSortable, n as arrayMove, r as sortableKeyboardCoordinates, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/question-renderer-96Awxkzp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SingleChoiceQuestion({ question, value, onChange, disabled, reveal }) {
	const selected = value && "optionId" in value ? value.optionId : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		role: "radiogroup",
		"aria-label": "Answer options",
		children: (question.options ?? []).map((opt) => {
			const isSelected = selected === opt.id;
			const showCorrect = Boolean(reveal && reveal.correctAnswer.includes(opt.text) && isSelected);
			const showWrong = Boolean(reveal && !reveal.correct && isSelected);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": isSelected,
				disabled,
				onClick: () => onChange({ optionId: opt.id }),
				className: cn("flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors", "bg-option border-border hover:border-secondary", isSelected && "border-secondary bg-secondary/10 ring-1 ring-secondary", showCorrect && "border-success bg-success/10 ring-1 ring-success", showWrong && "border-danger bg-danger/10 ring-1 ring-danger", disabled && "opacity-80"),
				children: [showCorrect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 shrink-0 text-success" }) : showWrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-5 shrink-0 text-danger" }) : isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 shrink-0 text-secondary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-5 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt.text })]
			}, opt.id);
		})
	});
}
function MultiChoiceQuestion({ question, value, onChange, disabled, reveal }) {
	const selected = value && "optionIds" in value ? value.optionIds : [];
	const required = question.requiredAnswers;
	function toggle(id) {
		const set = new Set(selected);
		if (set.has(id)) set.delete(id);
		else set.add(id);
		onChange({ optionIds: [...set] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [required ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-1 text-sm text-muted",
			children: [
				"Select ",
				required,
				" answer",
				required === 1 ? "" : "s",
				". ",
				selected.length,
				" selected."
			]
		}) : null, (question.options ?? []).map((opt) => {
			const isSelected = selected.includes(opt.id);
			const showCorrect = Boolean(reveal?.correct && isSelected);
			const showWrong = Boolean(reveal && !reveal.correct && isSelected);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "checkbox",
				"aria-checked": isSelected,
				disabled,
				onClick: () => toggle(opt.id),
				className: cn("flex min-h-12 items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors", "bg-option border-border hover:border-secondary", isSelected && "border-secondary bg-secondary/10 ring-1 ring-secondary", showCorrect && "border-success bg-success/10 ring-1 ring-success", showWrong && "border-danger bg-danger/10 ring-1 ring-danger"),
				children: [showCorrect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-5 shrink-0 text-success" }) : showWrong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mt-0.5 size-5 shrink-0 text-danger" }) : isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheck, { className: "mt-0.5 size-5 shrink-0 text-secondary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "mt-0.5 size-5 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: opt.text })]
			}, opt.id);
		})]
	});
}
var DEFAULTS$1 = [{
	id: "true",
	text: "True"
}, {
	id: "false",
	text: "False"
}];
function TrueFalseQuestion(props) {
	const question = {
		...props.question,
		options: props.question.options?.length ? props.question.options : DEFAULTS$1
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SingleChoiceQuestion, {
		...props,
		question
	});
}
var DEFAULTS = [{
	id: "yes",
	text: "Yes"
}, {
	id: "no",
	text: "No"
}];
function YesNoQuestion(props) {
	const question = {
		...props.question,
		options: props.question.options?.length ? props.question.options : DEFAULTS
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SingleChoiceQuestion, {
		...props,
		question
	});
}
function MatchingQuestion({ question, value, onChange, disabled }) {
	const pairs = value && "pairs" in value ? value.pairs : {};
	const [picked, setPicked] = (0, import_react.useState)(null);
	const sources = question.sources ?? [];
	const targets = question.targets ?? [];
	const usedSources = new Set(Object.keys(pairs));
	function assign(sourceId, targetId) {
		const next = { ...pairs };
		for (const [s, t] of Object.entries(next)) if (t === targetId) delete next[s];
		next[sourceId] = targetId;
		onChange({ pairs: next });
		setPicked(null);
	}
	function onTarget(targetId) {
		if (picked) assign(picked, targetId);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Source"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: sources.map((s) => {
					const taken = usedSources.has(s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						onClick: () => setPicked(s.id),
						className: cn("min-h-12 rounded-lg border border-border bg-option px-3 py-2 text-left text-sm", picked === s.id && "border-secondary ring-1 ring-secondary", taken && "opacity-60"),
						children: [s.text, taken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-muted",
							children: "matched"
						}) : null]
					}, s.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium uppercase tracking-wide text-muted",
				children: "Situation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: targets.map((t) => {
					const sourceId = Object.entries(pairs).find(([, id]) => id === t.id)?.[0];
					const source = sources.find((s) => s.id === sourceId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						onClick: () => onTarget(t.id),
						className: cn("min-h-12 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm", source && "border-secondary bg-secondary/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-fg",
							children: t.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted",
							children: source ? `Matched: ${source.text}` : picked ? "Tap to assign" : "Unmatched"
						})]
					}, t.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					disabled,
					onClick: () => onChange({ pairs: {} }),
					children: "Reset matches"
				})
			})
		]
	});
}
function SortableRow({ id, index, label, disabled, total, onMove }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		disabled
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		ref: setNodeRef,
		style,
		className: cn("flex min-h-12 items-center gap-3 rounded-lg border border-border bg-option px-3 py-2 text-sm", isDragging && "z-10 shadow-card"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "grid h-11 w-11 shrink-0 place-items-center rounded-md text-muted hover:bg-card",
				"aria-label": "Drag to reorder",
				disabled,
				...attributes,
				...listeners,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 shrink-0 place-items-center rounded-md bg-card font-medium tabular-nums",
				children: index + 1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid h-8 w-8 place-items-center rounded-md hover:bg-card",
					"aria-label": "Move up",
					disabled: disabled || index === 0,
					onClick: () => onMove(index, -1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid h-8 w-8 place-items-center rounded-md hover:bg-card",
					"aria-label": "Move down",
					disabled: disabled || index === total - 1,
					onClick: () => onMove(index, 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
				})]
			})
		]
	});
}
function OrderingQuestion({ question, value, onChange, disabled }) {
	const base = (question.orderItems ?? []).map((i) => i.id);
	const ids = value && "itemIds" in value && value.itemIds.length ? value.itemIds : base;
	const label = (id) => question.orderItems?.find((i) => i.id === id)?.text ?? id;
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	const items = (0, import_react.useMemo)(() => ids, [ids]);
	function move(index, dir) {
		const next = ids.slice();
		const j = index + dir;
		if (j < 0 || j >= next.length) return;
		[next[index], next[j]] = [next[j], next[index]];
		onChange({ itemIds: next });
	}
	function onDragEnd(event) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = ids.indexOf(String(active.id));
		const newIndex = ids.indexOf(String(over.id));
		if (oldIndex < 0 || newIndex < 0) return;
		onChange({ itemIds: arrayMove(ids, oldIndex, newIndex) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
		sensors,
		collisionDetection: closestCenter,
		onDragEnd,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
			items,
			strategy: verticalListSortingStrategy,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-2",
				children: ids.map((id, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableRow, {
					id,
					index,
					total: ids.length,
					label: label(id),
					disabled,
					onMove: move
				}, id))
			})
		})
	});
}
function DropdownQuestion({ question, value, onChange, disabled }) {
	const blanks = value && "blanks" in value ? value.blanks : {};
	function setBlank(id, v) {
		onChange({ blanks: {
			...blanks,
			[id]: v
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-3",
		children: (question.blanks ?? []).map((blank, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex flex-col gap-1.5 rounded-lg border border-border bg-option p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mr-2 tabular-nums text-muted",
					children: [i + 1, "."]
				}), blank.prompt]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-11 rounded-md border border-border bg-card px-3 text-sm",
				disabled,
				value: blanks[blank.id] ?? "",
				onChange: (e) => setBlank(blank.id, e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Choose one…"
				}), blank.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c,
					children: c
				}, c))]
			})]
		}, blank.id))
	});
}
function ImageChoiceQuestion({ question, value, onChange, disabled, reveal }) {
	const selected = value && "optionId" in value ? value.optionId : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
		children: (question.options ?? []).map((opt) => {
			const isSelected = selected === opt.id;
			const showCorrect = Boolean(reveal?.correct && isSelected);
			const showWrong = Boolean(reveal && !reveal.correct && isSelected);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled,
				onClick: () => onChange({ optionId: opt.id }),
				className: cn("relative overflow-hidden rounded-xl border border-border bg-option text-left", isSelected && "border-secondary ring-2 ring-secondary", showCorrect && "border-success ring-2 ring-success", showWrong && "border-danger ring-2 ring-danger"),
				children: [
					opt.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: opt.imageUrl,
						alt: opt.alt || opt.text,
						className: "aspect-[4/3] w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid aspect-[4/3] place-items-center text-sm text-muted",
						children: opt.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block px-3 py-2 text-sm",
						children: opt.text
					}),
					isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-secondary text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
					}) : null
				]
			}, opt.id);
		})
	});
}
function QuestionRenderer({ question, value, onChange, disabled, reveal }) {
	switch (question.type) {
		case "SINGLE_CHOICE": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SingleChoiceQuestion, {
			question,
			value,
			onChange,
			disabled,
			reveal
		});
		case "TRUE_FALSE": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrueFalseQuestion, {
			question,
			value,
			onChange,
			disabled,
			reveal
		});
		case "YES_NO": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YesNoQuestion, {
			question,
			value,
			onChange,
			disabled,
			reveal
		});
		case "MULTIPLE_CHOICE": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiChoiceQuestion, {
			question,
			value,
			onChange,
			disabled,
			reveal
		});
		case "MATCHING": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchingQuestion, {
			question,
			value,
			onChange,
			disabled
		});
		case "ORDERING": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderingQuestion, {
			question,
			value,
			onChange,
			disabled
		});
		case "DROPDOWN": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownQuestion, {
			question,
			value,
			onChange,
			disabled
		});
		case "IMAGE_CHOICE": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageChoiceQuestion, {
			question,
			value,
			onChange,
			disabled,
			reveal
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			children: "Unsupported question type."
		});
	}
}
//#endregion
export { QuestionRenderer as t };
