import { type Metadata } from "next";
import { SERVICE_PAGES } from "@/components/landing-page/service-pages-data";
import { ServicePageTemplate } from "@/components/service-page-template";

const content = SERVICE_PAGES["womens-health-fertility"];
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.drbubalcare.com";

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  keywords: content.seo.keywords,
  alternates: { canonical: `${baseUrl}/services/womens-health-fertility` },
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    url: `${baseUrl}/services/womens-health-fertility`,
    images: [
      {
        url: `${baseUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: content.title,
      },
    ],
  },
};

export default function WomensHealthPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: content.title,
    description: content.description,
    url: `${baseUrl}/services/womens-health-fertility`,
    medicalSpecialty: "Gynecology",
    provider: {
      "@type": "Organization",
      name: "Dr. Bubal Care",
      url: baseUrl,
    },
  };

  return <ServicePageTemplate content={content} jsonLd={jsonLd} />;
}
