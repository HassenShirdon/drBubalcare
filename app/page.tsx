import Navigation from "@/components/landing-page/navigation";
import HeroSection from "@/components/landing-page/hero-section";
import ProblemSection from "@/components/landing-page/problem-section";
import HowItWorks from "@/components/landing-page/how-it-works";
import { SocialProofSection } from "@/components/landing-page/social-proof-section";
import SpecializationsSection from "@/components/landing-page/specializations-section";
import ServicesSection from "@/components/landing-page/services-section";
import TrustSection from "@/components/landing-page/trust-section";
import StatsBanner from "@/components/landing-page/stats-banner";
import CTASection from "@/components/landing-page/cta-section";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LatestNewsClient = dynamic(
  () => import("@/components/latest-news-client")
);

const ContactSection = dynamic(
  () => import("@/components/landing-page/contact-section")
);

export default function Home() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased selection:bg-healing-teal/30 selection:text-clinical-navy scroll-smooth">
      {/* Hero shell — nav + hero share one rounded clinical card */}
      <div className="mx-3 sm:mx-5 lg:mx-8 pt-3 sm:pt-5">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] bg-gradient-to-br from-evidence-blue-light/60 via-white to-surface-gray border border-surface-gray shadow-xl shadow-clinical-navy/5">
          {/* Soft background washes */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-evidence-blue-light/30 blur-3xl -translate-y-1/3 translate-x-1/4"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-healing-teal/5 blur-3xl translate-y-1/3 -translate-x-1/4"
          />

          <Navigation />
          <HeroSection />
        </div>
      </div>
      <main id="main-content">
        <ProblemSection />
        <HowItWorks />
        <SocialProofSection />
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
            <div className="font-headline-md text-xl font-bold text-white">
              Dr Bubal Care
            </div>
            <p className="text-white/80 max-w-xs text-xs leading-relaxed">
              Delivering uncompromising medical excellence and evidence-based
              guidance to patients globally.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">
              Clinical Navigation
            </h4>
            <div className="flex flex-col space-y-1.5">
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#home"
              >
                Home
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#services"
              >
                Services
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#about"
              >
                About
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#specializations"
              >
                Specializations
              </a>
              <Link
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="/news"
              >
                News
              </Link>
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#contact"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-label-md text-xs text-white uppercase tracking-wider opacity-60 font-semibold">
              Legal & Privacy
            </h4>
            <div className="flex flex-col space-y-1.5">
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#"
              >
                Terms & Conditions
              </a>
              <a
                className="text-white/80 hover:text-white transition-colors text-xs w-fit"
                href="#"
              >
                Patient Rights
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/60 text-xs">
            &copy; 2026 Dr Bubal Care. Evidence-based medical excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
