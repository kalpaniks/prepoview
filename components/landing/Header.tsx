import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
  return (
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
          <ThemeToggle />
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
  );
}
