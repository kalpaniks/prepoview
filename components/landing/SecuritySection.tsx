import Link from 'next/link';
import { Shield, Lock, Key } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="relative w-full px-6 pb-20 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(120,119,198,0.06),transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.06),transparent_50%)]" />

      <div className="mx-auto mt-10 w-full max-w-3xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground/80 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
              Security
            </div>
            <h2 className="text-fg-default mt-2 text-lg font-semibold">Security by design</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Encrypted credentials, read-only access, and instant revocation.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-card/50 ring-border/50 relative rounded-full p-2 ring-1">
              <Shield className="text-muted-foreground h-6 w-6 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          {/* <svg className="absolute top-0 left-4 hidden h-full w-8 sm:block" viewBox="0 0 48 400">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59,130,246,0.4)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.4)" />
              </linearGradient>
            </defs>
            <path
              d="M24 0 C24 50 24 50 24 80 S24 110 24 140 24 180 24 210 24 250 24 280 24 320 24 360"
              stroke="url(#grad)"
              strokeWidth="2"
              fill="none"
              className="animate-[dash_4s_linear_infinite]"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <style>{`@keyframes dash { to { stroke-dashoffset: -60; } }`}</style>
          </svg> */}

          <div className="space-y-3">
            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <Lock className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">Encrypted tokens</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                OAuth tokens are encrypted at rest and never stored in plaintext.
              </p>
            </div>

            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <Key className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">In-memory usage</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Tokens are decrypted only in-memory to call GitHub, then discarded.
              </p>
            </div>

            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <Shield className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">Instant revoke</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Revoke your GitHub token anytime. Access ends immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <Link
            href="/legal#permissions"
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Learn more about permissions →
          </Link>
        </div>
      </div>
    </section>
  );
}
