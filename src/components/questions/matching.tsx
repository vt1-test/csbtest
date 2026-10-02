import { useState } from "react";
import type { AnswerValue, ExamQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MatchingQuestion({
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
  const pairs = value && "pairs" in value ? value.pairs : {};
  const [picked, setPicked] = useState<string | null>(null);
  const sources = question.sources ?? [];
  const targets = question.targets ?? [];
  const usedSources = new Set(Object.keys(pairs));

  function assign(sourceId: string, targetId: string) {
    const next = { ...pairs };
    for (const [s, t] of Object.entries(next)) {
      if (t === targetId) delete next[s];
    }
    next[sourceId] = targetId;
    onChange({ pairs: next });
    setPicked(null);
  }

  function onTarget(targetId: string) {
    if (picked) assign(picked, targetId);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Source</p>
        <div className="flex flex-col gap-2">
          {sources.map((s) => {
            const taken = usedSources.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                disabled={disabled}
                onClick={() => setPicked(s.id)}
                className={cn(
                  "min-h-12 rounded-lg border border-border bg-option px-3 py-2 text-left text-sm",
                  picked === s.id && "border-secondary ring-1 ring-secondary",
                  taken && "opacity-60",
                )}
              >
                {s.text}
                {taken ? <span className="ml-2 text-xs text-muted">matched</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Situation</p>
        <div className="flex flex-col gap-2">
          {targets.map((t) => {
            const sourceId = Object.entries(pairs).find(([, id]) => id === t.id)?.[0];
            const source = sources.find((s) => s.id === sourceId);
            return (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => onTarget(t.id)}
                className={cn(
                  "min-h-12 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm",
                  source && "border-secondary bg-secondary/10",
                )}
              >
                <span className="block text-fg">{t.text}</span>
                <span className="mt-1 block text-xs text-muted">
                  {source ? `Matched: ${source.text}` : picked ? "Tap to assign" : "Unmatched"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="md:col-span-2">
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => onChange({ pairs: {} })}>
          Reset matches
        </Button>
      </div>
    </div>
  );
}
