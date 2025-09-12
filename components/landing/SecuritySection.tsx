import Link from 'next/link';
import { Shield, Lock, EyeOff, FileLock, Timer } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section
      id="security"
      className="border-border/60 bg-card/40 mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 pb-6 sm:p-10"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(120,119,198,0.06),transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.06),transparent_50%)]" />

      <div className="mx-auto mt-10 w-full max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground/80 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
              Security
            </div>
            <h2 className="text-fg-default mt-2 text-lg font-semibold">Security by design</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Core protections at a glance: token privacy, non‑access, read‑only, and
              server‑enforced limits.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-card/50 ring-border/50 relative rounded-full p-2 ring-1">
              <Shield className="text-muted-foreground h-6 w-6 animate-[pulse_2.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <Lock className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">Your token stays private</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Encrypted at rest, decrypted only in memory to call GitHub never stored in
                plaintext.
              </p>
            </div>
            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <EyeOff className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">We can’t read your repos</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Scopes are minimal, no browsing of your private code outside your explicit actions.
              </p>
            </div>

            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <FileLock className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">Read‑only viewer</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                No cloning or archives. File content is streamed with copy sensitive UI.
              </p>
            </div>

            <div className="bg-card/40 border-border/60 relative rounded-md border p-4 pl-12">
              <div className="bg-primary/10 text-primary absolute top-4 left-3 inline-grid size-7 place-items-center rounded">
                <Timer className="h-4 w-4" />
              </div>
              <div className="mb-1 text-sm font-medium">Server enforced limits</div>
              <p className="text-muted-foreground text-[12px] leading-relaxed">
                Expiry and view counts enforced on the server and re‑checked on every request.
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
