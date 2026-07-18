'use client';

import Navigation from '@/components/landing-page/navigation';
import HeroSection from '@/components/landing-page/hero-section';
import ProblemSection from '@/components/landing-page/problem-section';
import HowItWorks from '@/components/landing-page/how-it-works';
import SpecializationsSection from '@/components/landing-page/specializations-section';
import ServicesSection from '@/components/landing-page/services-section';
import TrustSection from '@/components/landing-page/trust-section';
import StatsBanner from '@/components/landing-page/stats-banner';
import LatestNewsClient from '@/components/latest-news-client';
import CTASection from '@/components/landing-page/cta-section';
import ContactSection from '@/components/landing-page/contact-section';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased pt-24 selection:bg-healing-teal/30 selection:text-clinical-navy scroll-smooth">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <SpecializationsSection />
        <ServicesSection />
        <TrustSection />
        <StatsBanner />
        <LatestNewsClient />
        <CTASection />
        <ContactSection />
      </main>
      <footer className="bg-clinical-navy w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 md:px-16 py-12 text-on-primary">
          <div className="space-y-3">
            <div className="font-headline-md text-xl font-bold text-white">Dr Bubal Care</div>
            <p className="text-white/80 max-w-xs text-xs leading-relaxed">Delivering uncompromising medical excellence and evidence-based guidance to patients globally.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">Clinical Navigation</h4>
            <div className="flex flex-col space-y-1.5">
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#home">Home</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#services">Services</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#about">About</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#specializations">Specializations</a>
              <Link className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="/news">News</Link>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#contact">Contact</a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">Legal &amp; Privacy</h4>
            <div className="flex flex-col space-y-1.5">
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Privacy Policy</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Terms & Conditions</a>
              <a className="text-white/80 hover:text-white transition-colors text-xs w-fit" href="#">Patient Rights</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/60 text-xs">&copy; 2026 Dr Bubal Care. Evidence-based medical excellence.</p>
        </div>
      </footer>
    </div>
  );
}
