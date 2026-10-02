import { createFileRoute } from "@tanstack/react-router";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { APP_NAME } from "@/lib/config";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-muted">
        <h1 className="font-serif text-3xl font-semibold text-fg">Terms of use</h1>
        <p className="mt-4">
          {APP_NAME} provides practice examinations for educational use. Do not use it to cheat on a live certification.
          Accounts, attempts, and results belong to the signed-in user. Administrators may review activity logs for
          integrity.
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
