import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bookmark, ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react";
import { ExamTimer } from "@/components/exam/exam-timer";
import { FeedbackBanner } from "@/components/exam/feedback-banner";
import { QuestionNavigator } from "@/components/exam/question-navigator";
import { QuestionRenderer } from "@/components/questions/question-renderer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  getExamState,
  heartbeatAttempt,
  markQuestion,
  saveAnswer,
  submitAttempt,
} from "@/lib/server/attempts";
import { isAnswered } from "@/lib/scoring";
import type { AnswerValue, SaveState } from "@/lib/types";

export const Route = createFileRoute("/exam/$attemptId")({ component: ExamPage });

function ExamPage() {
  const { attemptId } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const state = useQuery({
    queryKey: ["exam", attemptId],
    queryFn: () => getExamState({ data: { attemptId } }),
    refetchOnWindowFocus: false,
  });
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<
    Record<string, { correct: boolean; explanation: string; correctAnswer: string } | undefined>
  >({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hydrated = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!state.data || hydrated.current) return;
    hydrated.current = true;
    setAnswers(state.data.answers ?? {});
    setFeedback(state.data.feedback ?? {});
    setRemaining(state.data.remainingSeconds);
    const map: Record<string, boolean> = {};
    for (const n of state.data.navigator) map[n.id] = n.marked;
    setMarked(map);
  }, [state.data]);

  useEffect(() => {
    if (!state.data || state.data.attempt.status !== "IN_PROGRESS" || remaining == null) return;
    const id = window.setInterval(() => setRemaining((s) => (s == null ? s : Math.max(0, s - 1))), 1000);
    return () => window.clearInterval(id);
  }, [state.data, remaining == null]);

  useEffect(() => {
    if (!state.data || state.data.attempt.status !== "IN_PROGRESS") return;
    const id = window.setInterval(async () => {
      try {
        const beat = await heartbeatAttempt({ data: { attemptId } });
        setRemaining(beat.remainingSeconds);
        if (beat.status !== "IN_PROGRESS") {
          navigate({ to: "/results/$attemptId", params: { attemptId } });
        }
      } catch {
        /* keep local timer */
      }
    }, 20000);
    return () => window.clearInterval(id);
  }, [attemptId, navigate, state.data]);

  const submitMut = useMutation({
    mutationFn: () => submitAttempt({ data: { attemptId } }),
    onSuccess: () => navigate({ to: "/results/$attemptId", params: { attemptId } }),
  });

  useEffect(() => {
    if (
      remaining === 0 &&
      hydrated.current &&
      state.data?.attempt.status === "IN_PROGRESS" &&
      !submitting
    ) {
      setSubmitting(true);
      void submitMut.mutateAsync();
    }
  }, [remaining, state.data, submitMut, submitting]);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (state.data?.attempt.status === "IN_PROGRESS") {
        e.preventDefault();
        e.returnValue = "Your quiz is still in progress.";
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [state.data]);

  const persist = useCallback(
    async (questionId: string, answer: AnswerValue | null, attempt = 0) => {
      setSaveState("saving");
      try {
        const res = await saveAnswer({ data: { attemptId, questionId, answer } });
        setSaveState("saved");
        setRemaining(res.remainingSeconds);
        if ("feedback" in res && res.feedback) {
          setFeedback((prev) => ({ ...prev, [questionId]: res.feedback ?? undefined }));
        }
        window.setTimeout(() => setSaveState("idle"), 1200);
      } catch {
        if (attempt < 2) {
          window.setTimeout(() => {
            void persist(questionId, answer, attempt + 1);
          }, 800 * (attempt + 1));
          return;
        }
        setSaveState("error");
      }
    },
    [attemptId],
  );

  function queueSave(questionId: string, answer: AnswerValue | null) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      void persist(questionId, answer);
    }, 400);
  }

  const data = state.data;
  const questions = data?.questions ?? [];
  const current = questions[index];
  const answeredCount = questions.filter((q) => isAnswered(q.type, answers[q.id])).length;
  const markedCount = Object.values(marked).filter(Boolean).length;

  async function toggleMark() {
    if (!current) return;
    const next = !marked[current.id];
    setMarked((p) => ({ ...p, [current.id]: next }));
    await markQuestion({ data: { attemptId, questionId: current.id, marked: next } });
  }

  if (isPending) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading session…</div>;
  if (!user) return <RedirectToSignIn />;
  if (state.isLoading) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading exam…</div>;
  if (state.error) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <p className="text-sm text-danger">{state.error instanceof Error ? state.error.message : "Unable to load this attempt."}</p>
      </div>
    );
  }
  if (data && data.attempt.status !== "IN_PROGRESS") {
    navigate({ to: "/results/$attemptId", params: { attemptId } });
    return null;
  }
  if (!current || !data) return null;

  const fb = data.attempt.mode === "PRACTICE" ? feedback[current.id] : undefined;
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">{data.attempt.quizTitle}</p>
            <p className="text-sm font-medium tabular-nums">
              Question {index + 1} / {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted sm:inline" aria-live="polite">
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : saveState === "error" ? "Unable to save" : ""}
            </span>
            <ExamTimer remaining={remaining ?? data.remainingSeconds} />
            <Button variant="outline" size="sm" className="md:hidden" onClick={() => setNavOpen(true)} aria-label="Open navigator">
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 rounded-none" />
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1fr_240px]">
        <section className="rounded-xl border border-border bg-card p-5 md:p-7">
          {current.instruction ? <p className="mb-3 text-sm font-medium text-secondary">{current.instruction}</p> : null}
          <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-fg">{current.stem}</div>
          <div className="mt-6">
            <QuestionRenderer
              question={current}
              value={answers[current.id] ?? null}
              onChange={(next) => queueSave(current.id, next)}
              disabled={data.attempt.status !== "IN_PROGRESS"}
              reveal={fb ? { correct: fb.correct, correctAnswer: fb.correctAnswer } : null}
            />
          </div>
          {fb ? (
            <div className="mt-6">
              <FeedbackBanner correct={fb.correct} explanation={fb.explanation} correctAnswer={fb.correctAnswer} />
            </div>
          ) : null}
          <div className="mt-8 hidden items-center justify-between gap-3 md:flex">
            <Button variant="outline" disabled={index === 0 || !data.allowBack} onClick={() => setIndex((i) => i - 1)}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            <Button variant={marked[current.id] ? "secondary" : "outline"} onClick={() => void toggleMark()}>
              <Bookmark className="size-4" /> {marked[current.id] ? "Marked" : "Mark for review"}
            </Button>
            {index < questions.length - 1 ? (
              <Button
                onClick={() => {
                  void persist(current.id, answers[current.id] ?? null);
                  setIndex((i) => i + 1);
                }}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={() => setConfirm(true)}>Submit</Button>
            )}
          </div>
        </section>

        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Navigator</p>
            <QuestionNavigator
              items={questions.map((q) => ({
                id: q.id,
                marked: Boolean(marked[q.id]),
                answered: isAnswered(q.type, answers[q.id]),
              }))}
              currentIndex={index}
              onSelect={setIndex}
            />
            <Button className="mt-4 w-full" variant="secondary" onClick={() => setConfirm(true)}>
              Submit exam
            </Button>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card p-3 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <Button variant="outline" size="sm" disabled={index === 0 || !data.allowBack} onClick={() => setIndex((i) => i - 1)}>
            Back
          </Button>
          <Button variant="ghost" size="sm" onClick={() => void toggleMark()}>
            {marked[current.id] ? "Unmark" : "Mark"}
          </Button>
          {index < questions.length - 1 ? (
            <Button
              size="sm"
              onClick={() => {
                void persist(current.id, answers[current.id] ?? null);
                setIndex((i) => i + 1);
              }}
            >
              Next
            </Button>
          ) : (
            <Button size="sm" onClick={() => setConfirm(true)}>
              Submit
            </Button>
          )}
        </div>
      </div>

      {navOpen ? (
        <div className="fixed inset-0 z-40 bg-fg/40 md:hidden" role="dialog">
          <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-medium">Questions</p>
              <button type="button" onClick={() => setNavOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <QuestionNavigator
              items={questions.map((q) => ({
                id: q.id,
                marked: Boolean(marked[q.id]),
                answered: isAnswered(q.type, answers[q.id]),
              }))}
              currentIndex={index}
              onSelect={(i) => {
                setIndex(i);
                setNavOpen(false);
              }}
            />
          </div>
        </div>
      ) : null}

      {confirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-fg/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6" role="dialog" aria-labelledby="submit-title">
            <h2 id="submit-title" className="font-serif text-xl font-semibold">
              Submit this exam?
            </h2>
            <ul className="mt-4 space-y-1 text-sm text-muted">
              <li>Answered: {answeredCount}</li>
              <li>Unanswered: {questions.length - answeredCount}</li>
              <li>Marked: {markedCount}</li>
            </ul>
            <p className="mt-3 text-sm">Are you sure you want to submit? You cannot change answers afterward.</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button
                disabled={submitMut.isPending}
                onClick={() => {
                  setSubmitting(true);
                  void persist(current.id, answers[current.id] ?? null).then(() => submitMut.mutate());
                }}
              >
                {submitMut.isPending ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
