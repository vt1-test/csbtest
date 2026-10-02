import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListQuizzes, adminQuizAction, adminSaveQuiz } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/admin/quizzes")({ component: AdminQuizzes });

function AdminQuizzes() {
  const [q, setQ] = useState("");
  const list = useQuery({ queryKey: ["admin-quizzes", q], queryFn: () => adminListQuizzes({ data: { q, page: 1 } }) });
  const navigate = useNavigate();

  async function create() {
    const res = await adminSaveQuiz({
      data: {
        title: "Untitled quiz",
        description: "",
        instructions: "",
        category: "General",
        difficulty: "Intermediate",
        timeLimitSeconds: 1800,
        passingPercentage: 70,
        feedbackMode: "EXAM",
        showExplanation: true,
        showScoreImmediately: true,
        randomizeQuestions: false,
        randomizeOptions: true,
        allowBackNavigation: true,
        allowRetake: true,
        published: false,
        active: true,
      },
    });
    navigate({ to: "/admin/quizzes/$id", params: { id: res.id } });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold">Quizzes</h1>
        <Button onClick={() => void create()}>Create quiz</Button>
      </div>
      <Input className="mt-4 max-w-sm" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              {["Title", "Category", "Questions", "Status", "Updated", ""].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(list.data?.rows ?? []).map((row) => {
              const r = row as Record<string, unknown>;
              return (
                <tr key={String(r.id)} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">
                    <Link to="/admin/quizzes/$id" params={{ id: String(r.id) }} className="font-medium hover:underline">
                      {String(r.title)}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{String(r.category)}</td>
                  <td className="px-3 py-2 tabular-nums">{String(r.question_count)}</td>
                  <td className="px-3 py-2">
                    <Badge tone={r.published ? "success" : "neutral"}>{r.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-3 py-2 text-muted">{String(r.updated_at).slice(0, 16)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button className="text-secondary" onClick={() => void adminQuizAction({ data: { id: String(r.id), action: r.published ? "unpublish" : "publish" } }).then(() => list.refetch())}>
                        {r.published ? "Unpublish" : "Publish"}
                      </button>
                      <button className="text-muted" onClick={() => void adminQuizAction({ data: { id: String(r.id), action: "duplicate" } }).then(() => list.refetch())}>
                        Duplicate
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
