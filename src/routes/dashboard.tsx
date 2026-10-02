import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getDashboardStats } from "@/lib/server/attempts";
import { listPublishedQuizzes } from "@/lib/server/public";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { QuizCard } from "@/components/quiz-card";
import { Card } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, isPending } = useCurrentUserState();
  const stats = useQuery({ queryKey: ["dashboard", user?.id], queryFn: () => getDashboardStats(), enabled: Boolean(user) });
  const quizzes = useQuery({ queryKey: ["quizzes"], queryFn: () => listPublishedQuizzes() });
  if (isPending) {
    return (
      <div className="min-h-screen bg-bg">
        <PublicHeader />
        <main className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted">Loading dashboard…</main>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  const s = stats.data;
  const chart = (s?.recent ?? [])
    .filter((a) => a.percentage != null)
    .slice()
    .reverse()
    .map((a, i) => ({ i: i + 1, score: a.percentage, name: a.quizTitle }));

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Welcome back{user.displayName ? `, ${user.displayName}` : ""}.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Quizzes taken", s?.quizzesTaken ?? 0],
            ["Attempts", s?.attempts ?? 0],
            ["Average", s?.averageScore == null ? "—" : `${s.averageScore.toFixed(0)}%`],
            ["Best", s?.bestScore == null ? "—" : `${s.bestScore.toFixed(0)}%`],
            ["Pass rate", s?.passRate == null ? "—" : `${Math.round(s.passRate * 100)}%`],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{value}</p>
            </Card>
          ))}
        </div>
        {chart.length > 1 ? (
          <Card className="mt-6 p-4">
            <h2 className="text-sm font-medium">Score history</h2>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <XAxis dataKey="i" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="var(--color-secondary)" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : null}
        <h2 className="mt-10 font-serif text-xl font-semibold">Recent attempts</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase text-muted">
              <tr>
                {["Quiz", "Attempt", "Date", "Score", "Time", "Result", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(s?.recent ?? []).map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{a.quizTitle}</td>
                  <td className="px-4 py-3 tabular-nums">{a.attemptNumber}</td>
                  <td className="px-4 py-3">{formatDateTime(a.startedAt)}</td>
                  <td className="px-4 py-3 tabular-nums">{a.percentage == null ? "In progress" : `${a.percentage}%`}</td>
                  <td className="px-4 py-3 tabular-nums">{a.timeUsedSeconds == null ? "—" : formatDuration(a.timeUsedSeconds)}</td>
                  <td className="px-4 py-3">{a.status === "IN_PROGRESS" ? "In progress" : a.passed ? "Pass" : "Fail"}</td>
                  <td className="px-4 py-3">
                    {a.status === "IN_PROGRESS" ? (
                      <Link className="text-secondary hover:underline" to="/exam/$attemptId" params={{ attemptId: a.id }}>
                        Resume
                      </Link>
                    ) : (
                      <Link className="text-secondary hover:underline" to="/results/$attemptId" params={{ attemptId: a.id }}>
                        Review
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {(s?.recent ?? []).length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={7}>
                    No attempts yet. Start a quiz from the catalog.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <h2 className="mt-10 font-serif text-xl font-semibold">Available quizzes</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {(quizzes.data ?? []).map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
