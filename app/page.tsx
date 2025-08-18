import RootLayout from './layout';

export default function Home() {
  return (
    <RootLayout>
      <div className="bg-bg-default flex h-screen flex-col items-center justify-center">
        <h1 className="text-fg-default text-4xl font-bold">GitHub Readonly Share</h1>
        <p className="text-fg-muted text-lg">
          Share GitHub repositories as readonly views with GitHub-inspired dark mode.
        </p>
        <p className="text-fg-muted text-lg">
          Follow us on{' '}
          <a href="https://x.com/coolsite" className="text-fg-accent hover:underline">
            X
          </a>
        </p>
      </div>
    </RootLayout>
  );
}
