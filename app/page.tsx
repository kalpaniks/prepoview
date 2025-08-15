import RootLayout from './layout';

export default function Home() {
  return (
    <RootLayout>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">cool site is coming soon</h1>
        <p className="text-lg">We are working hard to bring you the best experience.</p>
        <p className="text-lg">
          Follow us on{' '}
          <a href="https://x.com/coolsite" className="text-blue-500">
            X
          </a>
        </p>
      </div>
    </RootLayout>
  );
}
