import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { adminOverview } from "@/lib/server/admin";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function AdminHome() {
  const stats = useQuery({ queryKey: ["admin-overview"], queryFn: () => adminOverview() });
  const s = stats.data;
  const items = [
    ["Total users", s?.totalUsers ?? "—"],
    ["Active users", s?.activeUsers ?? "—"],
    ["Quizzes", s?.totalQuizzes ?? "—"],
    ["Published", s?.publishedQuizzes ?? "—"],
    ["Questions", s?.questions ?? "—"],
    ["Attempts", s?.attempts ?? "—"],
    ["Average score", s?.averageScore == null ? "—" : `${s.averageScore.toFixed(1)}%`],
    ["Pass rate", s?.passRate == null ? "—" : `${Math.round(s.passRate * 100)}%`],
  ];
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Admin overview</h1>
      <p className="mt-1 text-sm text-muted">Live totals from the database — not placeholders.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <Card key={String(label)} className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
