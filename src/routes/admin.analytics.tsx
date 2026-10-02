import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminAnalytics } from "@/lib/server/admin";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDuration } from "@/lib/utils";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

function Analytics() {
  const data = useQuery({ queryKey: ["admin-analytics"], queryFn: () => adminAnalytics() });
  const s = data.data;
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Analytics</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Attempts", s?.attempts ?? 0],
          ["Unique users", s?.uniqueUsers ?? 0],
          ["Average", s?.averageScore == null ? "—" : `${s.averageScore.toFixed(1)}%`],
          ["Median", s?.medianScore == null ? "—" : `${s.medianScore.toFixed(1)}%`],
          ["Pass rate", s?.passRate == null ? "—" : `${Math.round(s.passRate * 100)}%`],
          ["Avg time", s?.averageTime == null ? "—" : formatDuration(s.averageTime)],
        ].map(([l, v]) => (
          <Card key={String(l)} className="p-4">
            <p className="text-xs uppercase text-muted">{l}</p>
            <p className="font-serif text-xl font-semibold tabular-nums">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-4">
        <h2 className="text-sm font-medium">Attempts over time</h2>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s?.byDay ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attempts" fill="#087CC1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="mt-6 p-4">
        <h2 className="text-sm font-medium">Performance by type</h2>
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s?.byType ?? []}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" fill="#10BFA3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <h2 className="mt-8 font-serif text-lg">Most missed questions</h2>
      <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
        {(s?.missed ?? []).map((m) => (
          <li key={m.id} className="px-4 py-3 text-sm">
            <p className="line-clamp-2">{m.stem}</p>
            <p className="mt-1 text-xs text-muted">
              Success {Math.round(m.success * 100)}% · {m.correct}/{m.attempts} correct
            </p>
          </li>
        ))}
        {(s?.missed ?? []).length === 0 ? <li className="px-4 py-6 text-sm text-muted">No scored attempts yet.</li> : null}
      </ul>
    </div>
  );
}
