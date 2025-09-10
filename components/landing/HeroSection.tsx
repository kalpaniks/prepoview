import { LoginWithGitHub } from '@/components/auth/Login';

export default function HeroSection() {
  return (
    <main className="relative mx-auto flex w-full flex-1 flex-col items-center justify-center px-4 sm:px-6">
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
  );
}
