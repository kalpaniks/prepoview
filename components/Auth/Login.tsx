'use client';
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';

export function LoginWithGitHub({ callbackUrl = '/share' }: { callbackUrl?: string }) {
  return (
    <button
      onClick={() => signIn('github', { callbackUrl })}
      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors"
    >
      <Github className="h-4 w-4" />
      Continue with GitHub
    </button>
  );
}
