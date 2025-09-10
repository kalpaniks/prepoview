import Link from 'next/link';
import { LoginWithGitHub } from '@/components/auth/Login';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Frame container */}
      <div className="border-border/60 mx-auto flex min-h-screen w-full max-w-6xl flex-col border">
        {/* Header */}
        <header className="bg-card/40 border-border/60 border-b">
          <div className="mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <div>
                <svg className="h-5 w-auto" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 10H10V0H20V10H30V20H20V30H10V20H0V10ZM10 10V20H20V10H10Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-md font-semibold tracking-tight">Prepoview</span>
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

        <main className="relative mx-auto flex w-full flex-1 flex-col items-center justify-center px-4 sm:px-6">
          {/* Gradient backdrop */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(120,119,198,0.06),transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.06),transparent_50%)]" />

          <section className="w-full">
            <div className="border-border/60 bg-card/40 mx-auto max-w-3xl p-8 sm:p-10">
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
                <LoginWithGitHub />
              </div>

              {/* Detail separators */}
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
                  <p className="text-xs font-medium">No direct copy</p>
                  <p className="text-[11px]">File content streamed, no direct copy and download.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-border/60 bg-card/30 border-t">
          <div className="text-muted-foreground mx-auto flex w-full items-center justify-between px-4 py-4 text-xs sm:px-6">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} PrepoView</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Built with security in mind</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/legal#privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/legal#terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
