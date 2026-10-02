import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { requestPasswordReset } from "@/lib/server/admin";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ ok: boolean; resetPath: string | null } | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await requestPasswordReset({ data: { email } });
      setResult(res);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-3xl font-semibold">Reset password</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email. If an account exists, a one-hour reset token is created.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        {result ? (
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm">
            <p>If that email is registered, a reset link is ready.</p>
            {result.resetPath ? (
              <p className="mt-2">
                Preview environments cannot send email, so your link is:{" "}
                <Link to="/reset-password" search={{ token: result.resetPath.split("token=")[1] }} className="text-secondary underline">
                  Continue to reset
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}
      </main>
      <PublicFooter />
    </div>
  );
}
