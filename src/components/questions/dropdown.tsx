import type { AnswerValue, ExamQuestion } from "@/lib/types";

export function DropdownQuestion({
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
  const blanks = value && "blanks" in value ? value.blanks : {};
  function setBlank(id: string, v: string) {
    onChange({ blanks: { ...blanks, [id]: v } });
  }
  return (
    <div className="flex flex-col gap-3">
      {(question.blanks ?? []).map((blank, i) => (
        <label key={blank.id} className="flex flex-col gap-1.5 rounded-lg border border-border bg-option p-3">
          <span className="text-sm text-fg">
            <span className="mr-2 tabular-nums text-muted">{i + 1}.</span>
            {blank.prompt}
          </span>
          <select
            className="h-11 rounded-md border border-border bg-card px-3 text-sm"
            disabled={disabled}
            value={blanks[blank.id] ?? ""}
            onChange={(e) => setBlank(blank.id, e.target.value)}
          >
            <option value="">Choose one…</option>
            {blank.choices.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
