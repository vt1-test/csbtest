import { CircleCheck, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackBanner({
  correct,
  explanation,
  correctAnswer,
}: {
  correct: boolean;
  explanation?: string;
  correctAnswer?: string;
}) {
  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium",
          correct ? "border-success bg-success/10 text-success-fg" : "border-danger bg-danger/10 text-danger",
        )}
        role="status"
      >
        {correct ? <CircleCheck className="size-5" /> : <CircleX className="size-5" />}
        {correct ? "Correct" : "Incorrect"}
      </div>
      {!correct && correctAnswer ? (
        <p className="text-sm text-fg">
          <span className="font-medium">Correct answer: </span>
          {correctAnswer}
        </p>
      ) : null}
      {explanation ? (
        <div className="rounded-lg border border-border bg-option px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Explanation</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">{explanation}</p>
        </div>
      ) : null}
    </div>
  );
}
