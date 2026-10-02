import { Link } from "@tanstack/react-router";
import { APP_NAME } from "@/lib/config";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/server/attempts";

export function PublicHeader() {
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["me", user?.id],
    queryFn: () => getMyProfile(),
    enabled: Boolean(user),
  });

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            M
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-fg">{APP_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
          <Link to="/quizzes" className="hover:text-fg">
            Catalog
          </Link>
          <SignedIn>
            <Link to="/dashboard" className="hover:text-fg">
              Dashboard
            </Link>
            {profile.data?.role === "ADMIN" ? (
              <Link to="/admin" className="hover:text-fg">
                Admin
              </Link>
            ) : null}
          </SignedIn>
        </nav>
        <div className="flex items-center gap-2">
          {isPending ? <div className="h-8 w-24 animate-pulse rounded-full bg-option" /> : null}
          <SignedOut>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Create account</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {APP_NAME} · Professional mock exams
        </p>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-fg">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-fg">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
