import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-border/60 bg-card/30 border-t">
      <div className="text-muted-foreground mx-auto flex w-full items-center justify-between px-4 py-4 text-xs sm:px-6">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Repofyi</span>
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
  );
}
