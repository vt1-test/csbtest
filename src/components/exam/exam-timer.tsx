import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export function ExamTimer({ remaining }: { remaining: number }) {
  const state = remaining <= 0 ? "expired" : remaining <= 60 ? "critical" : remaining <= 300 ? "warning" : "normal";
  const label =
    state === "expired"
      ? "Time expired"
      : state === "critical"
        ? "Less than one minute remaining"
        : state === "warning"
          ? "Five minutes remaining"
          : "Time remaining";
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1.5 font-medium tabular-nums",
        state === "normal" && "bg-option text-fg",
        state === "warning" && "bg-warning/15 text-warning",
        state === "critical" && "bg-danger/15 text-danger",
        state === "expired" && "bg-danger text-white",
      )}
      role="timer"
      aria-label={label}
    >
      <Clock className="size-4" aria-hidden />
      <span>{formatDuration(remaining)}</span>
      {state !== "normal" ? (
        <span className="text-xs font-medium uppercase tracking-wide">
          {state === "expired" ? "Expired" : state === "critical" ? "Critical" : "Warning"}
        </span>
      ) : null}
    </div>
  );
}
