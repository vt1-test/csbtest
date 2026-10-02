import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { APP_NAME } from "@/lib/config";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const { error: err } = await authClient.signIn.email({
        email,
        password,
        rememberMe: remember,
      });
      if (err) throw new Error(err.message ?? "Sign in failed");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto grid max-w-md px-4 py-16">
        <h1 className="font-serif text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Use your {APP_NAME} account to resume attempts and view results.</p>
        {error ? <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p> : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={show ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4" />
            Remember me
          </label>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-3 text-sm">
          <Link to="/forgot-password" className="text-secondary hover:underline">
            Forgot password?
          </Link>
        </p>
        {authEnabled ? (
          <div className="mt-8 space-y-2">
            <p className="text-center text-xs uppercase tracking-wide text-muted">Or continue with</p>
            {GROK_PROVIDERS.map((p) => (
              <Button key={p.providerId} type="button" variant="outline" className="w-full" onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}>
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : null}
        <p className="mt-6 text-sm text-muted">
          No account?{" "}
          <Link to="/signup" className="font-medium text-secondary hover:underline">
            Create one
          </Link>
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
