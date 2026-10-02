import { useMemo } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

function SortableRow({
  id,
  index,
  label,
  disabled,
  total,
  onMove,
}: {
  id: string;
  index: number;
  label: string;
  disabled?: boolean;
  total: number;
  onMove: (index: number, dir: -1 | 1) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-lg border border-border bg-option px-3 py-2 text-sm",
        isDragging && "z-10 shadow-card",
      )}
    >
      <button
        type="button"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-muted hover:bg-card"
        aria-label="Drag to reorder"
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-card font-medium tabular-nums">
        {index + 1}
      </span>
      <span className="flex-1">{label}</span>
      <div className="flex flex-col">
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-md hover:bg-card"
          aria-label="Move up"
          disabled={disabled || index === 0}
          onClick={() => onMove(index, -1)}
        >
          <ChevronUp className="size-4" />
        </button>
        <button
          type="button"
          className="grid h-8 w-8 place-items-center rounded-md hover:bg-card"
          aria-label="Move down"
          disabled={disabled || index === total - 1}
          onClick={() => onMove(index, 1)}
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
    </li>
  );
}

export function OrderingQuestion({
  question,
  value,
  onChange,
  disabled,
}: {
  question: ExamQuestion;
  value: AnswerValue | null;
  onChange: (next: AnswerValue) => void;
  disabled?: boolean;
}) {
  const base = (question.orderItems ?? []).map((i) => i.id);
  const ids = value && "itemIds" in value && value.itemIds.length ? value.itemIds : base;
  const label = (id: string) => question.orderItems?.find((i) => i.id === id)?.text ?? id;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const items = useMemo(() => ids, [ids]);

  function move(index: number, dir: -1 | 1) {
    const next = ids.slice();
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange({ itemIds: next });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onChange({ itemIds: arrayMove(ids, oldIndex, newIndex) });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ol className="flex flex-col gap-2">
          {ids.map((id, index) => (
            <SortableRow
              key={id}
              id={id}
              index={index}
              total={ids.length}
              label={label(id)}
              disabled={disabled}
              onMove={move}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
