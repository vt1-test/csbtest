import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetQuiz, adminSaveQuiz } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/quizzes/$id")({ component: QuizEditor });

function QuizEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const data = useQuery({ queryKey: ["admin-quiz", id], queryFn: () => adminGetQuiz({ data: { id } }) });
  const [form, setForm] = useState<Record<string, string | number | boolean | null>>({});
  useEffect(() => {
    if (!data.data) return;
    const q = data.data.quiz as Record<string, unknown>;
    setForm({
      title: String(q.title),
      slug: String(q.slug),
      description: String(q.description),
      instructions: String(q.instructions),
      category: String(q.category),
      difficulty: String(q.difficulty),
      timeLimitSeconds: Number(q.time_limit_seconds),
      passingPercentage: Number(q.passing_percentage),
      feedbackMode: String(q.feedback_mode),
      published: Boolean(q.published),
      active: Boolean(q.active),
      randomizeQuestions: Boolean(q.randomize_questions),
      randomizeOptions: Boolean(q.randomize_options),
      allowBackNavigation: Boolean(q.allow_back_navigation),
      allowRetake: Boolean(q.allow_retake),
      maxAttempts: q.max_attempts == null ? "" : Number(q.max_attempts),
    });
  }, [data.data]);

  const save = useMutation({
    mutationFn: () =>
      adminSaveQuiz({
        data: {
          id,
          title: String(form.title),
          slug: String(form.slug),
          description: String(form.description ?? ""),
          instructions: String(form.instructions ?? ""),
          category: String(form.category),
          difficulty: String(form.difficulty),
          timeLimitSeconds: Number(form.timeLimitSeconds),
          passingPercentage: Number(form.passingPercentage),
          feedbackMode: form.feedbackMode === "PRACTICE" ? "PRACTICE" : "EXAM",
          published: Boolean(form.published),
          active: Boolean(form.active),
          randomizeQuestions: Boolean(form.randomizeQuestions),
          randomizeOptions: Boolean(form.randomizeOptions),
          allowBackNavigation: Boolean(form.allowBackNavigation),
          allowRetake: Boolean(form.allowRetake),
          maxAttempts: form.maxAttempts === "" || form.maxAttempts == null ? null : Number(form.maxAttempts),
          showExplanation: true,
          showScoreImmediately: true,
        },
      }),
    onSuccess: () => {
      toast.success("Quiz saved");
      void qc.invalidateQueries({ queryKey: ["admin-quiz", id] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (!data.data) return <p className="text-sm text-muted">Loading editor…</p>;
  const questions = data.data.questions;

  function field(key: string, label: string, type: "text" | "number" | "textarea" | "checkbox" | "select" = "text", options?: string[]) {
    return (
      <div className="space-y-1.5">
        <Label>{label}</Label>
        {type === "textarea" ? (
          <Textarea value={String(form[key] ?? "")} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
        ) : type === "checkbox" ? (
          <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} />
        ) : type === "select" ? (
          <select className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm" value={String(form[key])} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}>
            {options?.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <Input type={type} value={String(form[key] ?? "")} onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-serif text-2xl font-semibold">Edit quiz</h1>
      {field("title", "Title")}
      {field("slug", "Slug")}
      {field("description", "Description", "textarea")}
      {field("instructions", "Instructions", "textarea")}
      {field("category", "Category")}
      {field("difficulty", "Difficulty", "select", ["Beginner", "Intermediate", "Advanced"])}
      {field("timeLimitSeconds", "Duration (seconds)", "number")}
      {field("passingPercentage", "Passing %", "number")}
      {field("feedbackMode", "Default mode", "select", ["EXAM", "PRACTICE"])}
      {field("maxAttempts", "Max attempts (blank = unlimited)")}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {["published", "active", "randomizeQuestions", "randomizeOptions", "allowBackNavigation", "allowRetake"].map((k) => (
          <label key={k} className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(form[k])} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.checked }))} />
            {k}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
        <Button variant="outline" asChild>
          <Link to="/quizzes/$slug" params={{ slug: String(form.slug || "") }}>
            Preview as student
          </Link>
        </Button>
      </div>
      <h2 className="pt-6 font-serif text-xl">Questions ({questions.length})</h2>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {questions.map((q) => (
          <li key={q.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="line-clamp-2">
              <span className="mr-2 text-muted">{q.position}.</span>
              {q.stem.slice(0, 140)}
            </span>
            <Link className="shrink-0 text-secondary" to="/admin/questions/$id" params={{ id: q.id }}>
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Button variant="outline" asChild>
        <Link to="/admin/questions" search={{ quizId: id }}>
          Manage questions
        </Link>
      </Button>
    </div>
  );
}
