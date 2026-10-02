import { Circle, CircleCheck, CircleX } from "lucide-react";
import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SingleChoiceQuestion({
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
  const selected = value && "optionId" in value ? value.optionId : null;
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answer options">
      {(question.options ?? []).map((opt) => {
        const isSelected = selected === opt.id;
        const showCorrect = Boolean(reveal && reveal.correctAnswer.includes(opt.text) && isSelected);
        const showWrong = Boolean(reveal && !reveal.correct && isSelected);
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange({ optionId: opt.id })}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
              "bg-option border-border hover:border-secondary",
              isSelected && "border-secondary bg-secondary/10 ring-1 ring-secondary",
              showCorrect && "border-success bg-success/10 ring-1 ring-success",
              showWrong && "border-danger bg-danger/10 ring-1 ring-danger",
              disabled && "opacity-80",
            )}
          >
            {showCorrect ? (
              <CircleCheck className="size-5 shrink-0 text-success" />
            ) : showWrong ? (
              <CircleX className="size-5 shrink-0 text-danger" />
            ) : isSelected ? (
              <CircleCheck className="size-5 shrink-0 text-secondary" />
            ) : (
              <Circle className="size-5 shrink-0 text-muted" />
            )}
            <span>{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}
