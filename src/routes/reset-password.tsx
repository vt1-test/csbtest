import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { completePasswordReset } from "@/lib/server/admin";

type Search = { token?: string };

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>): Search => ({ token: typeof s.token === "string" ? s.token : "" }),
  component: Reset,
});

function Reset() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await completePasswordReset({ data: { token: token ?? "", password } });
      navigate({ to: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-3xl font-semibold">Choose a new password</h1>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={pending || !token}>
            {pending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </main>
      <PublicFooter />
    </div>
  );
}
