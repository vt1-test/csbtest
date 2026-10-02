import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminListQuizzes } from "@/lib/server/admin";
import { commitImport, parseDocxUpload, saveImportRecords } from "@/lib/server/import-api";
import type { ImportRecord } from "@/lib/import/docx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/import")({ component: ImportPage });

function ImportPage() {
  const quizzes = useQuery({ queryKey: ["admin-quizzes"], queryFn: () => adminListQuizzes({ data: { page: 1, pageSize: 100 } }) });
  const [jobId, setJobId] = useState<string | null>(null);
  const [report, setReport] = useState<Record<string, number> | null>(null);
  const [records, setRecords] = useState<ImportRecord[]>([]);
  const [quizId, setQuizId] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      const base64 = btoa(binary);
      const res = await parseDocxUpload({ data: { filename: file.name, base64 } });
      setJobId(res.jobId);
      setReport(res.report as unknown as Record<string, number>);
      setRecords(res.records);
      toast.success(`Detected ${res.report.detected} questions`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Parse failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-2xl font-semibold">DOCX import</h1>
      <p className="mt-1 text-sm text-muted">
        Upload a mock-exam Word file. Detected questions are reviewed before they are written to a quiz. Ambiguous
        records stay in Needs review — nothing is silently discarded.
      </p>
      <input
        className="mt-4 block text-sm"
        type="file"
        accept=".docx"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onFile(file);
        }}
      />
      {report ? (
        <dl className="mt-4 grid grid-cols-3 gap-3 text-sm sm:grid-cols-6">
          {Object.entries(report).map(([k, v]) => (
            <div key={k} className="rounded-md border border-border bg-card p-3">
              <dt className="text-xs uppercase text-muted">{k}</dt>
              <dd className="font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {records.length ? (
        <div className="mt-6 space-y-4">
          {records.map((rec, i) => (
            <div key={rec.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-medium">{rec.status}</span>
                <span>{rec.type}</span>
              </div>
              <Textarea
                className="mt-2 min-h-24"
                value={rec.stem}
                onChange={(e) => {
                  const next = records.slice();
                  next[i] = { ...rec, stem: e.target.value };
                  setRecords(next);
                }}
              />
              {rec.reviewNote ? <p className="mt-2 text-xs text-warning">{rec.reviewNote}</p> : null}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <select className="h-11 rounded-md border border-border bg-card px-3 text-sm" value={quizId} onChange={(e) => setQuizId(e.target.value)}>
              <option value="">Import into quiz…</option>
              {(quizzes.data?.rows ?? []).map((r) => {
                const row = r as { id: string; title: string };
                return (
                  <option key={row.id} value={row.id}>
                    {row.title}
                  </option>
                );
              })}
            </select>
            <Button
              disabled={!jobId || !quizId}
              onClick={() => {
                void (async () => {
                  await saveImportRecords({ data: { jobId: jobId!, records } });
                  const res = await commitImport({ data: { jobId: jobId!, quizId, onlyReady: false } });
                  toast.success(`Imported ${res.imported}, skipped ${res.skipped}`);
                })();
              }}
            >
              Approve & import
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
