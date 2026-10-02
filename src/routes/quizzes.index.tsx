import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { QuizCard } from "@/components/quiz-card";
import { Input } from "@/components/ui/input";
import { listPublishedQuizzes } from "@/lib/server/public";

export const Route = createFileRoute("/quizzes/")({ component: Catalog });

function Catalog() {
  const quizzes = useQuery({ queryKey: ["quizzes"], queryFn: () => listPublishedQuizzes() });
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const items = quizzes.data ?? [];
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const filtered = items.filter((i) => {
    if (category !== "all" && i.category !== category) return false;
    if (difficulty !== "all" && i.difficulty !== difficulty) return false;
    if (q && !`${i.title} ${i.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl font-semibold">Exam catalog</h1>
        <p className="mt-2 text-sm text-muted">Published mock exams available to registered candidates.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <Input placeholder="Search exams" value={q} onChange={(e) => setQ(e.target.value)} className="md:col-span-2" />
          <select className="h-11 rounded-md border border-border bg-card px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="h-11 rounded-md border border-border bg-card px-3 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="all">All difficulties</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
          {filtered.length === 0 ? <p className="text-sm text-muted">No published exams match those filters.</p> : null}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
