import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListUsers, adminUpdateUser } from "@/lib/server/admin";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const list = useQuery({ queryKey: ["admin-users"], queryFn: () => adminListUsers() });
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Users</h1>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              {["Name", "Email", "Role", "Registered", "Last login", "Attempts", "Avg", "Status", ""].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(list.data ?? []).map((row) => {
              const r = row as Record<string, unknown>;
              return (
                <tr key={String(r.user_id)} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">{String(r.full_name || "—")}</td>
                  <td className="px-3 py-2">{String(r.email || "—")}</td>
                  <td className="px-3 py-2">{String(r.role)}</td>
                  <td className="px-3 py-2">{formatDateTime(String(r.created_at))}</td>
                  <td className="px-3 py-2">{r.last_login_at ? formatDateTime(String(r.last_login_at)) : "—"}</td>
                  <td className="px-3 py-2 tabular-nums">{String(r.attempt_count)}</td>
                  <td className="px-3 py-2 tabular-nums">{r.avg_score == null ? "—" : `${Number(r.avg_score).toFixed(0)}%`}</td>
                  <td className="px-3 py-2">{String(r.status)}</td>
                  <td className="px-3 py-2">
                    <button
                      className="text-secondary"
                      onClick={() =>
                        void adminUpdateUser({
                          data: { userId: String(r.user_id), role: r.role === "ADMIN" ? "USER" : "ADMIN" },
                        }).then(() => list.refetch())
                      }
                    >
                      {r.role === "ADMIN" ? "Make user" : "Make admin"}
                    </button>
                    <button
                      className="ml-3 text-muted"
                      onClick={() =>
                        void adminUpdateUser({
                          data: { userId: String(r.user_id), status: r.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE" },
                        }).then(() => list.refetch())
                      }
                    >
                      {r.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
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
