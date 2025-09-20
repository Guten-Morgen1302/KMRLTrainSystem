import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustBadges from '@/components/TrustBadges';
import ProblemStatement from '@/components/ProblemStatement';
import Features from '@/components/Features';
import Demo from '@/components/Demo';
import KPIs from '@/components/KPIs';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import DarkVeil from '@/components/animations/DarkVeil';
import TargetCursor from '@/components/animations/TargetCursor';
import ScrollProgress from '@/components/animations/ScrollProgress';
import SectionReveal from '@/components/animations/SectionReveal';

export default function MetroYukthiLanding() {
  return (
    <div className="min-h-screen relative">
      {/* Scroll Progress Bar */}
      <ScrollProgress showLabel={false} />
      
      {/* Background Animations */}
      <DarkVeil 
        hueShift={0}
        noiseIntensity={0} 
        scanlineIntensity={0.3}
        speed={0.6}
        scanlineFrequency={0.8}
      />
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} />
      
      {/* Main Content with higher z-index */}
      <div className="relative z-10 bg-background/80">
        <Header />
        <main>
          {/* Hero section loads immediately, no reveal needed */}
          <Hero />
          
          {/* Staggered section reveals for impressive scroll experience */}
          <SectionReveal staggerChildren delay={0.1}>
            <TrustBadges />
          </SectionReveal>
          
          <SectionReveal delay={0.2}>
            <ProblemStatement />
          </SectionReveal>
          
          <SectionReveal staggerChildren delay={0.1}>
            <Features />
          </SectionReveal>
          
          <SectionReveal delay={0.3}>
            <Demo />
          </SectionReveal>
          
          <SectionReveal staggerChildren delay={0.2}>
            <KPIs />
          </SectionReveal>
          
          <SectionReveal staggerChildren delay={0.1}>
            <FAQ />
          </SectionReveal>
          
        </main>
        
        <SectionReveal delay={0.1}>
          <Footer />
        </SectionReveal>
      </div>
    </div>
  );
}