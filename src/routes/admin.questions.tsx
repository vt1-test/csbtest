import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListQuestions, adminListQuizzes, adminSaveQuestion } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QUESTION_TYPES } from "@/lib/types";
import { useState } from "react";

type Search = { quizId?: string };

export const Route = createFileRoute("/admin/questions")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    quizId: typeof s.quizId === "string" ? s.quizId : undefined,
  }),
  component: AdminQuestions,
});

function AdminQuestions() {
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const list = useQuery({
    queryKey: ["admin-questions", search.quizId, q, type],
    queryFn: () => adminListQuestions({ data: { quizId: search.quizId, q, type: type || undefined, page: 1 } }),
  });
  const quizzes = useQuery({ queryKey: ["admin-quizzes"], queryFn: () => adminListQuizzes({ data: { page: 1, pageSize: 100 } }) });
  const navigate = useNavigate();

  async function create() {
    const quizId = search.quizId || String((quizzes.data?.rows?.[0] as { id?: string } | undefined)?.id || "");
    if (!quizId) return;
    const res = await adminSaveQuestion({
      data: {
        quizId,
        type: "SINGLE_CHOICE",
        stem: "New question",
        instruction: "Choose one.",
        explanation: "",
        payload: { options: [{ id: "a", text: "Option A" }, { id: "b", text: "Option B" }], correctOptionIds: ["a"] },
        status: "draft",
      },
    });
    navigate({ to: "/admin/questions/$id", params: { id: res.id } });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold">Questions</h1>
        <Button onClick={() => void create()}>Create question</Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input placeholder="Search stem" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <select className="h-11 rounded-md border border-border bg-card px-3 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {QUESTION_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              {["Quiz", "Type", "Preview", "Status", "Review", ""].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(list.data?.rows ?? []).map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{row.quizTitle}</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2 max-w-md truncate">{row.stem}</td>
                <td className="px-3 py-2">{row.status}</td>
                <td className="px-3 py-2">{row.needsReview ? "Needs review" : "Ready"}</td>
                <td className="px-3 py-2">
                  <Link to="/admin/questions/$id" params={{ id: row.id }} className="text-secondary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
