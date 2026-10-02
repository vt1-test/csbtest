import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!terms) {
      setError("Please accept the terms to continue");
      return;
    }
    setPending(true);
    try {
      const { error: err } = await authClient.signUp.email({ email, password, name });
      if (err) throw new Error(err.message ?? "Sign up failed");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-muted">The first account on this workspace is granted administrator access.</p>
        {error ? <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p> : null}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 size-4" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-secondary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-secondary hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
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
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-secondary hover:underline">
            Sign in
          </Link>
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
