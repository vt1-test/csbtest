import { Link } from "@tanstack/react-router";
import { Clock, ListChecks } from "lucide-react";
import type { QuizSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

export function QuizCard({ quiz }: { quiz: QuizSummary }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge tone="info">{quiz.category}</Badge>
        <Badge>{quiz.difficulty}</Badge>
      </div>
      <h3 className="font-serif text-lg font-semibold text-fg">
        <Link to="/quizzes/$slug" params={{ slug: quiz.slug }} className="hover:text-secondary">
          {quiz.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{quiz.description}</p>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <ListChecks className="size-3.5" /> {quiz.questionCount} questions
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {formatDuration(quiz.timeLimitSeconds)}
        </span>
        <span>Pass {quiz.passingPercentage}%</span>
      </div>
    </Card>
  );
}
