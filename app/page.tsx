import Link from 'next/link';
import { Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border/60 bg-card/50 supports-[backdrop-filter]:bg-card/40 sticky top-0 z-10 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary border-border/60 grid h-7 w-7 place-content-center rounded-md border">
              <Github className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">PrepoView</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/kalpaniks/prepoview"
              target="_blank"
              className="border-border/60 bg-muted/60 hover:bg-muted/80 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors"
            >
              ⭐ Star on GitHub
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 sm:px-6">
        {/* subtle grid background */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(120,119,198,0.06),transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.06),transparent_50%)]" />

        <section className="w-full">
          <div className="border-border/60 bg-card/40 mx-auto max-w-3xl rounded-xl border p-8 sm:p-10">
            <div className="mb-6 flex items-center justify-center gap-2">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                Private • Secure • Time‑boxed
              </span>
            </div>

            <h1 className="text-center text-3xl leading-tight font-semibold sm:text-4xl">
              Share private repos read‑only
              <br className="hidden sm:block" /> with time & view limits
            </h1>

            <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-center text-sm sm:text-base">
              Grant safe, temporary access to your code without adding collaborators. Enforce
              expiration and view caps. No downloads.
            </p>

            <div className="mt-7 flex items-center justify-center gap-3">
              <Link
                href="/api/auth/signin"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors"
              >
                <Github className="h-4 w-4" />
                Continue with GitHub
              </Link>
            </div>

            {/* detail separators */}
            <div className="text-muted-foreground/80 mt-8 grid grid-cols-1 gap-3 border-t pt-6 sm:grid-cols-3">
              <div className="border-border/60 rounded-md border p-3">
                <p className="text-xs font-medium">Ephemeral sessions</p>
                <p className="text-[11px]">
                  Auto‑expire access mid‑view and recheck on every request.
                </p>
              </div>
              <div className="border-border/60 rounded-md border p-3">
                <p className="text-xs font-medium">View limits</p>
                <p className="text-[11px]">Count once per session. Race‑proof increments.</p>
              </div>
              <div className="border-border/60 rounded-md border p-3">
                <p className="text-xs font-medium">No downloads</p>
                <p className="text-[11px]">File content streamed, no raw repo checkout.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border/60 bg-card/30 w-full border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs sm:px-6">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} PrepoView</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Built with security in mind</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
