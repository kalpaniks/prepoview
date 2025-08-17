import RootLayout from './layout';

export default function Home() {
  return (
    <RootLayout>
      <div
        className="flex h-screen flex-col items-center justify-center"
        style={{ backgroundColor: 'var(--bgColor-default)' }}
      >
        <h1 className="text-4xl font-bold" style={{ color: 'var(--fgColor-default)' }}>
          GitHub Readonly Share
        </h1>
        <p className="text-lg" style={{ color: 'var(--fgColor-muted)' }}>
          Share GitHub repositories as readonly views with GitHub-inspired dark mode.
        </p>
        <p className="text-lg" style={{ color: 'var(--fgColor-muted)' }}>
          Follow us on{' '}
          <a
            href="https://x.com/coolsite"
            className="hover:underline"
            style={{ color: 'var(--fgColor-accent)' }}
          >
            X
          </a>
        </p>
      </div>
    </RootLayout>
  );
}
