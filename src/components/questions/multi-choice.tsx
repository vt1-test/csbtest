import { Square, SquareCheck, CircleCheck, CircleX } from "lucide-react";
import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MultiChoiceQuestion({
  question,
  value,
  onChange,
  disabled,
  reveal,
}: {
  question: ExamQuestion;
  value: AnswerValue | null;
  onChange: (next: AnswerValue) => void;
  disabled?: boolean;
  reveal?: { correct: boolean; correctAnswer: string } | null;
}) {
  const selected = value && "optionIds" in value ? value.optionIds : [];
  const required = question.requiredAnswers;
  function toggle(id: string) {
    const set = new Set(selected);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ optionIds: [...set] });
  }
  return (
    <div className="flex flex-col gap-2">
      {required ? (
        <p className="mb-1 text-sm text-muted">
          Select {required} answer{required === 1 ? "" : "s"}. {selected.length} selected.
        </p>
      ) : null}
      {(question.options ?? []).map((opt) => {
        const isSelected = selected.includes(opt.id);
        const showCorrect = Boolean(reveal?.correct && isSelected);
        const showWrong = Boolean(reveal && !reveal.correct && isSelected);
        return (
          <button
            key={opt.id}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex min-h-12 items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              "bg-option border-border hover:border-secondary",
              isSelected && "border-secondary bg-secondary/10 ring-1 ring-secondary",
              showCorrect && "border-success bg-success/10 ring-1 ring-success",
              showWrong && "border-danger bg-danger/10 ring-1 ring-danger",
            )}
          >
            {showCorrect ? (
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
            ) : showWrong ? (
              <CircleX className="mt-0.5 size-5 shrink-0 text-danger" />
            ) : isSelected ? (
              <SquareCheck className="mt-0.5 size-5 shrink-0 text-secondary" />
            ) : (
              <Square className="mt-0.5 size-5 shrink-0 text-muted" />
            )}
            <span>{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}
