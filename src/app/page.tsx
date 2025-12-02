import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CleanWorld from '@/components/CleanWorld';
import StatsCards from '@/components/StatsCards';
import SpeakersSection from '@/components/SpeakersSection';
import LogosSection from '@/components/LogosSection';
import ExhibitionCards from '@/components/ExhibitionCards';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* Mobile Demo Message */}
      <div className="lg:hidden fixed inset-0 bg-white flex items-center justify-center z-50">
        <p className="text-[#1F1919] text-base font-medium text-center px-6">
          DEMO DEVELOPMENT BY WEPEAK.EU
        </p>
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:block">
        <SmoothScroll />
        <Navbar />
        <Hero />
        <CleanWorld />
        <StatsCards />
        <SpeakersSection />
        <LogosSection />
        <ExhibitionCards />
        <Footer />
      </div>
    </main>
  );
}
