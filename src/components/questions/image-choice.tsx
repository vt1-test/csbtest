import { Check } from "lucide-react";
import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ImageChoiceQuestion({
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {(question.options ?? []).map((opt) => {
        const isSelected = selected === opt.id;
        const showCorrect = Boolean(reveal?.correct && isSelected);
        const showWrong = Boolean(reveal && !reveal.correct && isSelected);
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ optionId: opt.id })}
            className={cn(
              "relative overflow-hidden rounded-xl border border-border bg-option text-left",
              isSelected && "border-secondary ring-2 ring-secondary",
              showCorrect && "border-success ring-2 ring-success",
              showWrong && "border-danger ring-2 ring-danger",
            )}
          >
            {opt.imageUrl ? (
              <img src={opt.imageUrl} alt={opt.alt || opt.text} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center text-sm text-muted">{opt.text}</div>
            )}
            <span className="block px-3 py-2 text-sm">{opt.text}</span>
            {isSelected ? (
              <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-secondary text-white">
                <Check className="size-4" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
