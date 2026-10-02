import { createFileRoute } from "@tanstack/react-router";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { APP_NAME } from "@/lib/config";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-muted">
        <h1 className="font-serif text-3xl font-semibold text-fg">Privacy</h1>
        <p className="mt-4">
          {APP_NAME} stores your name, email, exam answers, and scores to operate the service. Passwords are hashed.
          We do not sell personal data. You may request account deactivation from an administrator.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
