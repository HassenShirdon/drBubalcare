import type { Metadata } from "next";
import { Outfit, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { cn } from "@/lib/utils";
import MaterialSymbolsLink from "./MaterialSymbolsLink";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.drbubalcare.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Dr. Bubal Care - Expert Medical Opinions by Our Global Doctors Network",
    template: "%s | Dr. Bubal Care",
  },
  description:
    "Connect with board-certified physicians in our Global Doctors Network for plain-language diagnostic opinions. Upload lab results, scans, or slides. Secure, HIPAA-aware, and designed for patients in East Africa.",
  keywords: [
    "global doctors network",
    "expert second opinion",
    "medical opinion online",
    "pathology review",
    "radiology interpretation",
    "telehealth East Africa",
    "lab results explained",
  ],
  authors: [{ name: "Dr. Bubal Care" }],
  creator: "Dr. Bubal Care",
  publisher: "Dr. Bubal Care",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Dr. Bubal Care",
    title: "Dr. Bubal Care - Expert Medical Opinions by Our Global Doctors Network",
    description:
      "Board-certified physicians in our Global Doctors Network review your case and return a plain-language written opinion you can trust.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Dr. Bubal Care â€” connect with the physicians of our Global Doctors Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Bubal Care - Expert Medical Opinions by Our Global Doctors Network",
    description:
      "Board-certified physicians in our Global Doctors Network review your case and return a plain-language written opinion you can trust.",
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
      suppressHydrationWarning
      className={cn(outfit.variable, instrument.variable, "font-sans")}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="theme-color"
          content="#002D62"
          media="(prefers-color-scheme: dark)"
        />
        <MaterialSymbolsLink />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-landing-brand focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-white/70"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
