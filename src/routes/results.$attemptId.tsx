import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { FeedbackBanner } from "@/components/exam/feedback-banner";
import { QuestionNavigator } from "@/components/exam/question-navigator";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getAttemptResult } from "@/lib/server/attempts";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/results/$attemptId")({ component: ResultPage });

function ResultPage() {
  const { attemptId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const result = useQuery({
    queryKey: ["result", attemptId],
    queryFn: () => getAttemptResult({ data: { attemptId } }),
    enabled: Boolean(user),
  });
  const [open, setOpen] = useState<number | null>(null);

  if (isPending) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading…</div>;
  if (!user) return <RedirectToSignIn />;
  if (result.isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <PublicHeader />
        <main className="mx-auto max-w-4xl px-4 py-16 text-sm text-muted">Scoring your attempt…</main>
      </div>
    );
  }
  if (result.error || !result.data) {
    return (
      <div className="min-h-screen bg-bg">
        <PublicHeader />
        <main className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-sm text-danger">{result.error instanceof Error ? result.error.message : "Result unavailable."}</p>
        </main>
      </div>
    );
  }
  const { attempt, review } = result.data;
  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted">{attempt.quizTitle}</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Results</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Card className="p-5 sm:col-span-1">
            <p className="text-xs uppercase text-muted">Score</p>
            <p className="font-serif text-4xl font-semibold tabular-nums">{attempt.percentage?.toFixed(0)}%</p>
            <Badge className="mt-2" tone={attempt.passed ? "success" : "danger"}>
              {attempt.passed ? "Pass" : "Fail"}
            </Badge>
          </Card>
          <Card className="p-5 sm:col-span-3">
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">Attempt</dt>
                <dd className="font-medium">{attempt.attemptNumber}</dd>
              </div>
              <div>
                <dt className="text-muted">Submitted</dt>
                <dd className="font-medium">{formatDateTime(attempt.submittedAt)}</dd>
              </div>
              <div>
                <dt className="text-muted">Time used</dt>
                <dd className="font-medium">{attempt.timeUsedSeconds ? formatDuration(attempt.timeUsedSeconds) : "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Correct</dt>
                <dd className="font-medium">{attempt.correctCount}</dd>
              </div>
              <div>
                <dt className="text-muted">Incorrect</dt>
                <dd className="font-medium">{attempt.incorrectCount}</dd>
              </div>
              <div>
                <dt className="text-muted">Unanswered</dt>
                <dd className="font-medium">{attempt.unansweredCount}</dd>
              </div>
            </dl>
          </Card>
        </div>
        <div className="mt-8">
          <h2 className="font-serif text-xl font-semibold">Review answers</h2>
          <div className="mt-3">
            <QuestionNavigator
              items={review.map((r) => ({
                id: r.question.id,
                marked: false,
                answered: !r.unanswered,
                correct: r.unanswered ? false : r.isCorrect,
              }))}
              currentIndex={open ?? 0}
              onSelect={(i) => setOpen(i)}
              review
            />
          </div>
          <div className="mt-6 space-y-4">
            {review.map((item, i) => (
              <Card key={item.question.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">Question {item.position}</p>
                  <Badge tone={item.unanswered ? "warning" : item.isCorrect ? "success" : "danger"}>
                    {item.unanswered ? "Unanswered" : item.isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{item.question.stem}</p>
                <div className="mt-4 opacity-90">
                  <QuestionRenderer question={item.exam} value={item.answer} onChange={() => undefined} disabled />
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Your answer: </span>
                    {item.userAnswerLabel}
                  </p>
                  <p>
                    <span className="font-medium">Correct answer: </span>
                    {item.correctAnswerLabel}
                  </p>
                </div>
                {item.question.explanation ? (
                  <div className="mt-4">
                    <FeedbackBanner
                      correct={item.isCorrect}
                      explanation={item.question.explanation}
                      correctAnswer={item.correctAnswerLabel}
                    />
                  </div>
                ) : null}
                <span className="sr-only">{i}</span>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
