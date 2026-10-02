import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminAuditLog, adminExportQuestionsJson } from "@/lib/server/admin";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({ component: Settings });

function Settings() {
  const log = useQuery({ queryKey: ["audit"], queryFn: () => adminAuditLog() });

  async function exportJson() {
    const res = await adminExportQuestionsJson({ data: {} });
    const blob = new Blob([JSON.stringify(res.questions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "question-bank.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted">Brand, export, and audit trail.</p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={() => void exportJson()}>
          Export question bank JSON
        </Button>
      </div>
      <h2 className="mt-8 font-serif text-lg">Audit log</h2>
      <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card text-sm">
        {(log.data ?? []).map((row) => {
          const r = row as Record<string, unknown>;
          return (
            <li key={String(r.id)} className="px-4 py-3">
              <p>
                <span className="font-medium">{String(r.action)}</span> · {String(r.entity_type)} {String(r.entity_id ?? "")}
              </p>
              <p className="text-xs text-muted">
                {formatDateTime(String(r.created_at))} · actor {String(r.actor_id ?? "system")}
              </p>
            </li>
          );
        })}
        {(log.data ?? []).length === 0 ? <li className="px-4 py-6 text-muted">No admin actions recorded yet.</li> : null}
      </ul>
    </div>
  );
}
