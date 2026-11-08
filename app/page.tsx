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
import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const LatestNewsClient = dynamic(
  () => import("@/components/latest-news-client")
);

const ContactSection = dynamic(
  () => import("@/components/landing-page/contact-section")
);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.drbubalcare.com";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Dr. Bubal Care",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description:
          "AI-assisted diagnostic coordination platform connecting patients with board-certified physicians in our Global Doctors Network for written medical opinions.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-312-847-1928",
          contactType: "Patient Support",
          availableLanguage: ["English"],
        },
        sameAs: [],
      },
      {
        "@type": "MedicalWebPage",
        name: "Dr. Bubal Care - Expert Medical Opinions from the Global Doctors Network",
        url: baseUrl,
        description:
          "Connect with board-certified doctors in our Global Doctors Network for plain-language diagnostic opinions. Upload lab results, scans, or slides.",
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
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Dr. Bubal Care logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-white object-cover p-1"
              />
              <span className="text-xl font-bold text-white">
                Dr. Bubal Care
              </span>
            </div>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed">
              Connecting patients in East Africa with the board-certified
              physicians of our Global Doctors Network for clear, written
              diagnostic opinions.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/70">
              Explore
            </h4>
            <nav className="flex flex-col space-y-1.5">
              <a
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="#home"
              >
                Home
              </a>
              <a
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="#services"
              >
                Services
              </a>
              <a
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="#about"
              >
                About
              </a>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="/news"
              >
                News
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/70">
              Legal
            </h4>
            <nav className="flex flex-col space-y-1.5">
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="/terms"
              >
                Terms of Use
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                href="/patient-rights"
              >
                Patient Rights
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-white/10 py-5">
          <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} Dr. Bubal Care. All rights reserved.
            </p>
            <a
              href="#home"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
