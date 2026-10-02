import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminExportResultsCsv, adminListResults } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/admin/results")({ component: AdminResults });

function AdminResults() {
  const list = useQuery({ queryKey: ["admin-results"], queryFn: () => adminListResults({ data: { page: 1 } }) });

  async function exportCsv() {
    const { csv } = await adminExportResultsCsv();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Results</h1>
        <Button variant="outline" onClick={() => void exportCsv()}>
          Export CSV
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              {["User", "Quiz", "#", "Score", "%", "Correct", "Time", "Submitted", "Status"].map((h) => (
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
                  <td className="px-3 py-2">{String(r.user_name)}</td>
                  <td className="px-3 py-2">{String(r.quiz_title)}</td>
                  <td className="px-3 py-2">{String(r.attempt_number)}</td>
                  <td className="px-3 py-2">{String(r.score ?? "—")}</td>
                  <td className="px-3 py-2">{r.percentage == null ? "—" : `${Number(r.percentage).toFixed(0)}%`}</td>
                  <td className="px-3 py-2">{String(r.correct_count ?? "—")}</td>
                  <td className="px-3 py-2">{r.time_used_seconds ? formatDuration(Number(r.time_used_seconds)) : "—"}</td>
                  <td className="px-3 py-2">{r.submitted_at ? formatDateTime(String(r.submitted_at)) : "—"}</td>
                  <td className="px-3 py-2">{String(r.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
