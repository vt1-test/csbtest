import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/server/attempts";
import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const LINKS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/quizzes", label: "Quizzes", exact: false },
  { to: "/admin/questions", label: "Questions", exact: false },
  { to: "/admin/import", label: "Import", exact: false },
  { to: "/admin/users", label: "Users", exact: false },
  { to: "/admin/results", label: "Results", exact: false },
  { to: "/admin/analytics", label: "Analytics", exact: false },
  { to: "/admin/settings", label: "Settings", exact: false },
] as const;

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({ queryKey: ["me", user?.id], queryFn: () => getMyProfile(), enabled: Boolean(user) });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isPending) return <div className="grid min-h-screen place-items-center text-sm text-muted">Loading…</div>;
  if (!user) return <RedirectToSignIn />;
  if (profile.isLoading) return <div className="grid min-h-screen place-items-center text-sm text-muted">Checking access…</div>;
  if (profile.data?.role !== "ADMIN") {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="font-serif text-2xl">Admin only</h1>
          <p className="mt-2 text-sm text-muted">Your account does not have administrator permission.</p>
          <Link to="/dashboard" className="mt-4 inline-block text-secondary hover:underline">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-border bg-card md:min-h-screen md:border-b-0 md:border-r">
        <div className="px-4 py-5">
          <Link to="/" className="font-serif text-lg font-semibold">
            {APP_NAME}
          </Link>
          <p className="text-xs text-muted">Administration</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm whitespace-nowrap",
                  active ? "bg-option font-medium text-fg" : "text-muted hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-14 items-center justify-end border-b border-border bg-card px-4 text-sm">
          <Link to="/dashboard" className="text-muted hover:text-fg">
            Exit admin
          </Link>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
