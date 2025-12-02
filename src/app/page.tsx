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
      <SmoothScroll />
      <Navbar />
        <Hero />
        <CleanWorld />
        <StatsCards />
        <SpeakersSection />
        <LogosSection />
        <ExhibitionCards />
        <Footer />
    </main>
  );
}
