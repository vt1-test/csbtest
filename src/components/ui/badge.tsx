import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "success" | "danger" | "warning" | "info" }) {
  const tones = {
    neutral: "bg-option text-fg",
    success: "bg-success/15 text-success-fg",
    danger: "bg-danger/10 text-danger",
    warning: "bg-warning/15 text-warning",
    info: "bg-secondary/10 text-secondary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
