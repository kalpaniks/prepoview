'use client';
import { Github, Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginWithGitHub({ callbackUrl = '/share' }: { callbackUrl?: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (isLoading) return;
    setIsLoading(true);
    if (status === 'authenticated') {
      router.push(callbackUrl);
      return;
    }
    signIn('github', { callbackUrl, redirect: true }).finally(() => setIsLoading(false));
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      aria-busy={isLoading}
      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-w-32 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors"
    >
      {isLoading || status === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Github className="h-4 w-4" />
      )}
      {isLoading || status === 'loading' ? '' : 'Continue with GitHub'}
    </button>
  );
}
