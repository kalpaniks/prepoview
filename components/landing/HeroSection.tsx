import { LoginWithGitHub } from '@/components/auth/Login';
import Herosvg from '@/components/landing/Herosvg';

export default function HeroSection() {
  return (
    <main className="relative mx-auto flex w-full flex-1 flex-col items-center justify-start px-4 py-8 sm:px-6 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(120,119,198,0.06),transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.06),transparent_50%)]" />

      <section className="w-full">
        <div className="border-border/60 bg-card/40 mx-auto grid max-w-5xl grid-cols-1 gap-8 p-5 sm:grid-cols-2 sm:gap-10 sm:p-10">
          <div className="flex flex-col justify-start text-left">
            <div className="mb-3 flex items-center justify-start gap-2">
              <span className="text-muted-foreground text-xs tracking-wider uppercase">
                Trust first
              </span>
              <span className="text-muted-foreground/60 text-[10px]">Server‑enforced limits</span>
            </div>

            <h1 className="max-w-[560px] text-2xl leading-tight font-semibold text-balance sm:text-4xl">
              Share private repos without granting permanent access
            </h1>

            <p className="text-muted-foreground mt-3 max-w-[200px] text-sm sm:max-w-[450px] sm:text-base">
              Time and view limited, server enforced access. Read-only viewer, no cloning or zip
              downloads.
            </p>

            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-start">
              <LoginWithGitHub />
              <a
                href="#security"
                className="ml-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                How our security works
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end">
            <Herosvg className="w-full max-w-[420px] sm:max-w-[460px]" />
          </div>
        </div>
      </section>
    </main>
  );
}
