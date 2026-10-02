import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, ShieldCheck, TimerReset } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/layout/public-header";
import { QuizCard } from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import { listPublishedQuizzes } from "@/lib/server/public";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const quizzes = useQuery({ queryKey: ["quizzes"], queryFn: () => listPublishedQuizzes() });
  const featured = quizzes.data ?? [];

  return (
    <div className="min-h-screen bg-bg">
      <PublicHeader />
      <main>
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-secondary">{APP_TAGLINE}</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-fg md:text-5xl">
                Sit a mock exam the way you will sit the real one.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
                Timed attempts, autosaved answers, and scored review — including matching, ordering, dropdown, and
                image questions from professional certification banks.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/quizzes">
                    Browse exams <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/signup">Create a free account</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-bg p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Live exam chrome</p>
              <div className="mt-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Question 11 / 41</span>
                  <span className="tabular-nums text-secondary">24:35</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-option">
                  <div className="h-full w-2/3 bg-primary" />
                </div>
                <div className="mt-4 space-y-2">
                  {["Table", "Bar Chart", "Line Chart", "Pie Chart"].map((label, i) => (
                    <div
                      key={label}
                      className={`rounded-md border px-3 py-2 text-sm ${i === 3 ? "border-secondary bg-secondary/10" : "border-border bg-option"}`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: TimerReset, title: "Authoritative timer", body: "Server time is the source of truth. Refreshing the page never resets the clock." },
              { icon: ShieldCheck, title: "Secure scoring", body: "Answer keys stay on the server. Practice feedback is per-question; exams score on submit." },
              { icon: Clock, title: "Persistent attempts", body: "Answers autosave as you work. Resume the same attempt with the same order and marks." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-5">
                <item.icon className="size-5 text-secondary" />
                <h2 className="mt-3 font-serif text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold">Featured exams</h2>
              <p className="text-sm text-muted">Published banks available to signed-in candidates.</p>
            </div>
            <Link to="/quizzes" className="text-sm font-medium text-secondary hover:underline">
              View catalog
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
