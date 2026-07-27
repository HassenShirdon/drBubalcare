import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { cn } from "@/lib/utils";
import MaterialSymbolsLink from "./MaterialSymbolsLink";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://drbubalcare.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Dr Bubal Care — Specialist Medical Opinions in 24–48 Hours",
    template: "%s | Dr Bubal Care",
  },
  description:
    "Connect with board-certified specialists for plain-language diagnostic opinions. Upload lab results, scans, or slides. Secure, HIPAA-aware, and designed for patients in East Africa.",
  keywords: [
    "specialist second opinion",
    "medical opinion online",
    "pathology review",
    "radiology interpretation",
    "telehealth East Africa",
    "lab results explained",
  ],
  authors: [{ name: "Dr Bubal Care" }],
  creator: "Dr Bubal Care",
  publisher: "Dr Bubal Care",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Dr Bubal Care",
    title: "Dr Bubal Care — Specialist Medical Opinions in 24–48 Hours",
    description:
      "Board-certified specialists review your case and return a plain-language written opinion you can trust.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Dr Bubal Care — connect with board-certified specialists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr Bubal Care — Specialist Medical Opinions in 24–48 Hours",
    description:
      "Board-certified specialists review your case and return a plain-language written opinion you can trust.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(manrope.variable, inter.variable, "font-sans")}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
        <MaterialSymbolsLink />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#1E3A5F] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
