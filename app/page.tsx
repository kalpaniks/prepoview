import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import SecuritySection from '@/components/landing/SecuritySection';
import Footer from '@/components/landing/Footer';
import TrustBar from '@/components/landing/TrustBar';

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="border-border/60 mx-auto flex min-h-screen w-full max-w-6xl flex-col border">
        <Header />
        <TrustBar />
        <HeroSection />
        <SecuritySection />
        <Footer />
      </div>
    </div>
  );
}
