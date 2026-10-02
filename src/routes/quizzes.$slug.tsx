import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getQuizBySlug } from "@/lib/server/public";
import { getMyQuizProgress, startAttempt } from "@/lib/server/attempts";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatDuration } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/quizzes/$slug")({ component: QuizDetails });

function QuizDetails() {
  const { slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const quiz = useQuery({ queryKey: ["quiz", slug], queryFn: () => getQuizBySlug({ data: { slug } }) });
  const progress = useQuery({
    queryKey: ["progress", quiz.data?.id, user?.id],
    queryFn: () => getMyQuizProgress({ data: { quizId: quiz.data!.id } }),
    enabled: Boolean(user && quiz.data),
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(mode: "PRACTICE" | "EXAM") {
    if (!quiz.data) return;
    setBusy(mode);
    setError(null);
    try {
      const res = await startAttempt({ data: { quizId: quiz.data.id, mode } });
      navigate({ to: "/exam/$attemptId", params: { attemptId: res.attemptId } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start");
    } finally {
      setBusy(null);
    }
  }

  if (quiz.isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <PublicHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted">Loading exam…</main>
      </div>
    );
  }
  if (!quiz.data) {
    return (
      <div className="min-h-screen bg-bg">
        <PublicHeader />
        <main className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="font-serif text-2xl">Exam not found</h1>
          <p className="mt-2 text-sm text-muted">This exam is unpublished, archived, or does not exist.</p>
        </main>
      </div>
    );
  }
  const q = quiz.data;
  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{q.category}</Badge>
          <Badge>{q.difficulty}</Badge>
          <Badge tone={q.published ? "success" : "neutral"}>{q.published ? "Published" : "Draft"}</Badge>
        </div>
        <h1 className="mt-4 font-serif text-3xl font-semibold">{q.title}</h1>
        <p className="mt-3 text-muted">{q.description}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">Questions</dt>
            <dd className="font-medium">{q.questionCount}</dd>
          </div>
          <div>
            <dt className="text-muted">Time limit</dt>
            <dd className="font-medium">{formatDuration(q.timeLimitSeconds)}</dd>
          </div>
          <div>
            <dt className="text-muted">Passing score</dt>
            <dd className="font-medium">{q.passingPercentage}%</dd>
          </div>
          <div>
            <dt className="text-muted">Attempts</dt>
            <dd className="font-medium">{q.maxAttempts == null ? "Unlimited" : q.maxAttempts}</dd>
          </div>
        </dl>
        <section className="mt-8 rounded-xl border border-border bg-card p-5">
          <h2 className="font-serif text-lg font-semibold">Instructions</h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted">{q.instructions}</pre>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>The timer is enforced on the server. Closing the tab does not pause it.</li>
            <li>{q.allowBackNavigation ? "You may move backward between questions." : "Back navigation is disabled."}</li>
            <li>Practice mode shows correctness and explanations after each answer. Exam mode hides the key until submit.</li>
            <li>Unanswered questions are scored as incorrect. Submit is confirmed before it locks.</li>
          </ul>
        </section>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isPending ? <p className="text-sm text-muted">Checking session…</p> : null}
          {!isPending && !user ? (
            <Button asChild>
              <Link to="/login">Sign in to start</Link>
            </Button>
          ) : null}
          {user && progress.data?.inProgressId ? (
            <Button asChild>
              <Link to="/exam/$attemptId" params={{ attemptId: progress.data.inProgressId }}>
                Resume quiz
              </Link>
            </Button>
          ) : null}
          {user && !progress.data?.inProgressId ? (
            <>
              <Button disabled={busy !== null || progress.data?.canStart === false} onClick={() => start("EXAM")}>
                {busy === "EXAM" ? "Starting…" : "Start exam"}
              </Button>
              <Button variant="outline" disabled={busy !== null || progress.data?.canStart === false} onClick={() => start("PRACTICE")}>
                {busy === "PRACTICE" ? "Starting…" : "Practice mode"}
              </Button>
            </>
          ) : null}
        </div>
        {progress.data?.attemptsRemaining != null ? (
          <p className="mt-3 text-sm text-muted">{progress.data.attemptsRemaining} attempt(s) remaining.</p>
        ) : null}
      </main>
      <PublicFooter />
    </div>
  );
}
