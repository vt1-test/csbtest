import { cn } from "@/lib/utils";

export function QuestionNavigator({
  items,
  currentIndex,
  onSelect,
  review,
}: {
  items: { id: string; marked: boolean; answered: boolean; correct?: boolean | null }[];
  currentIndex: number;
  onSelect: (index: number) => void;
  review?: boolean;
}) {
  return (
    <div className="grid grid-cols-7 gap-1.5" role="navigation" aria-label="Question navigator">
      {items.map((item, i) => {
        const current = i === currentIndex;
        let tone = "border-border bg-card text-muted";
        if (review && item.correct === true) tone = "border-success bg-success/15 text-success-fg";
        else if (review && item.correct === false) tone = "border-danger bg-danger/10 text-danger";
        else if (item.marked) tone = "border-warning bg-warning/15 text-warning";
        else if (item.answered) tone = "border-secondary/40 bg-secondary/10 text-secondary";
        if (current) tone += " ring-2 ring-secondary";
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "grid h-11 min-w-11 place-items-center rounded-md border text-sm font-medium tabular-nums",
              tone,
            )}
            aria-current={current ? "step" : undefined}
            aria-label={`Question ${i + 1}${item.answered ? ", answered" : ", unanswered"}${item.marked ? ", marked" : ""}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
