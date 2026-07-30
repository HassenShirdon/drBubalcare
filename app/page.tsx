import Navigation from "@/components/landing-page/navigation";
import HeroSection from "@/components/landing-page/hero-section";
import ProblemSection from "@/components/landing-page/problem-section";
import HowItWorks from "@/components/landing-page/how-it-works";
import SpecializationsSection from "@/components/landing-page/specializations-section";
import ServicesSection from "@/components/landing-page/services-section";
import TrustSection from "@/components/landing-page/trust-section";
import StatsBanner from "@/components/landing-page/stats-banner";
import { SocialProofSection } from "@/components/landing-page/social-proof-section";
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://drbubalcare.com";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Dr Bubal Care",
        url: baseUrl,
        logo: `${baseUrl}/logo.svg`,
        description:
          "AI-assisted diagnostic coordination platform connecting patients with board-certified specialists for written medical opinions.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-800-555-1234",
          contactType: "Patient Support",
          availableLanguage: ["English"],
        },
        sameAs: [],
      },
      {
        "@type": "MedicalWebPage",
        name: "Dr Bubal Care - Specialist Medical Opinions",
        url: baseUrl,
        description:
          "Connect with board-certified specialists for plain-language diagnostic opinions. Upload lab results, scans, or slides.",
        about: {
          "@type": "MedicalSpecialty",
          name: "Diagnostic Medicine",
        },
        audience: {
          "@type": "Patient",
          healthCondition: {
            "@type": "MedicalSpecialty",
            name: "Undiagnosed or unclear medical results",
          },
        },
      },
    ],
  };

  return (
    <div className="bg-landing-surface text-landing-text antialiased selection:bg-landing-success/30 selection:text-landing-brand scroll-smooth">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header>
        <Navigation />
      </header>
      <HeroSection />
      <main id="main-content">
        <ProblemSection />
        <HowItWorks />
        <SpecializationsSection />
        <ServicesSection />
        <TrustSection />
        <StatsBanner />
        <SocialProofSection />
        <Suspense fallback={null}>
          <LatestNewsClient />
        </Suspense>
        <CTASection />
        <Suspense fallback={null}>
          <ContactSection />
        </Suspense>
      </main>
      <footer className="bg-landing-brand w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 md:px-16 py-12">
          <div className="space-y-3 md:col-span-2">
            <div className="text-xl font-bold text-white">
              Dr Bubal Care
            </div>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed">
              Connecting patients in East Africa with board-certified
              specialists for clear, written diagnostic opinions.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-1.5">
              <a
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="#home"
              >
                Home
              </a>
              <a
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="#services"
              >
                Services
              </a>
              <a
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="#about"
              >
                About
              </a>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/news"
              >
                News
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Legal
            </h4>
            <nav className="flex flex-col space-y-1.5">
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/terms"
              >
                Terms of Use
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/patient-rights"
              >
                Patient Rights
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Dr Bubal Care. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
