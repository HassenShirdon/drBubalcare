import type { Metadata } from 'next';

export const SITE = {
  name: 'Dr. Bubal Care',
  url: 'https://www.drbubalcare.com',
  description: 'AI-assisted diagnostic coordination platform. Get board-certified specialist opinions on lab results, biopsies, and medical images in 24-48 hours.',
  ogImage: '/og-default.png',
} as const;

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  const { openGraph: ogOverrides, twitter: twitterOverrides, ...rest } = overrides;

  return {
    metadataBase: new URL(SITE.url),
    openGraph: {
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
      ...ogOverrides,
    },
    twitter: {
      card: 'summary_large_image',
      ...twitterOverrides,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...rest,
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
