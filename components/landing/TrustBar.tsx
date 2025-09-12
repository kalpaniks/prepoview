import Link from 'next/link';
import { Lock, EyeOff, Shield } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="bg-card/40 border-border/60 hidden border-b md:block">
      <div className="mx-auto flex h-10 w-full items-center justify-center gap-4 px-4 text-xs sm:gap-6 sm:px-6">
        <TrustItem
          icon={<Lock className="h-3.5 w-3.5" />}
          label="Encrypted GitHub tokens"
          href="#security"
        />
        <Divider />
        <TrustItem
          icon={<EyeOff className="h-3.5 w-3.5" />}
          label="We can’t read your repos"
          href="#security"
        />
        <Divider />
        <TrustItem
          icon={<Shield className="h-3.5 w-3.5" />}
          label="Read‑only shares (no downloads)"
          href="#security"
        />
      </div>
    </div>
  );
}

function TrustItem({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
      aria-label={label}
    >
      <span className="text-muted-foreground/80 border-border/60 bg-muted/40 inline-flex items-center justify-center rounded border p-1">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function Divider() {
  return <span className="bg-border/60 hidden h-3 w-px sm:inline-block" />;
}
