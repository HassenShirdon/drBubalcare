import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/landing-page/animate-on-scroll";
import { ServiceFAQ } from "@/components/service-faq";
import { SERVICES } from "@/components/landing-page/data";
import type { ServicePageContent } from "@/components/landing-page/service-pages-data";

function getRelatedServices(
  slugs: string[],
  currentId: string
): (typeof SERVICES)[number][] {
  return SERVICES.filter((s) => {
    const slug = s.link.replace("/services/", "");
    return slugs.includes(slug) && slug !== currentId;
  }).slice(0, 3);
}

function Breadcrumbs({ title }: { title: string }) {
  return (
    <nav className="max-w-7xl mx-auto px-6 md:px-16 pt-6 pb-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-landing-text-faint">
        <li>
          <Link href="/" className="hover:text-landing-brand transition-colors">
            Home
          </Link>
        </li>
        <li>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </li>
        <li>
          <Link href="/#services" className="hover:text-landing-brand transition-colors">
            Services
          </Link>
        </li>
        <li>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </li>
        <li className="text-landing-text font-medium truncate max-w-[200px] md:max-w-none">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function HeroSection({
  content,
}: {
  content: ServicePageContent;
}) {
  return (
    <section className="grain relative overflow-hidden bg-gradient-to-b from-landing-accent-soft to-landing-surface">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 right-[-6%] w-[420px] h-[420px] rounded-full bg-landing-brand/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16">
        <Breadcrumbs title={content.title} />
        <div className="flex flex-col items-center text-center pb-16 md:pb-20 pt-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-landing-text tracking-tight leading-[1.1] text-balance max-w-3xl">
            {content.heroTitle}
          </h1>
          <p className="mt-5 text-lg text-landing-text-muted leading-relaxed max-w-2xl text-balance">
            {content.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 bg-landing-brand text-white text-base font-semibold px-7 py-3.5 rounded-xl hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 active:scale-[0.98] transition-all duration-200 shadow-soft"
            >
              Book a consultation
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 border border-landing-border text-landing-text bg-landing-surface-card px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-landing-surface-muted transition-colors duration-200"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Introduction({ content }: { content: ServicePageContent }) {
  return (
    <section className="py-16 md:py-20 bg-landing-surface-card border-y border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            What is the {content.title}?
          </h2>
          <p className="mt-5 text-lg text-landing-text-muted leading-relaxed">
            {content.introduction}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

function WhoCanBenefit({ content }: { content: ServicePageContent }) {
  return (
    <section className="py-16 md:py-20 bg-landing-surface border-b border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            Who can benefit?
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Our services are designed for a wide range of patients and families.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.whoCanBenefit.map((item) => (
            <AnimateOnScroll key={item.title}>
              <div className="card-hairline h-full rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-landing-accent-soft flex items-center justify-center text-landing-accent mb-4">
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-landing-text mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-landing-text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeOffer({ content }: { content: ServicePageContent }) {
  return (
    <section className="py-16 md:py-20 bg-landing-surface-card border-b border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            Our services
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Comprehensive care tailored to your specific needs.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {content.whatWeOffer.map((item) => (
            <AnimateOnScroll key={item.title}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-landing-accent-soft flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-landing-accent" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-landing-text mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-landing-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <section className="py-16 md:py-20 bg-landing-surface border-b border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            How it works
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Four simple steps to get the care you need.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div
            className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-landing-brand/15"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.title} className="relative">
              <div className="w-14 h-14 rounded-2xl bg-landing-accent-soft flex items-center justify-center text-landing-accent relative z-10">
                <span className="font-mono text-lg font-semibold">{i + 1}</span>
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-landing-text mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-landing-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function RequiredDocuments({
  documents,
}: {
  documents: string[];
}) {
  if (documents.length === 0) return null;
  return (
    <section className="py-16 md:py-20 bg-landing-surface-card border-b border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            Required documents
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Please have these documents ready when starting your case.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <div className="card-hairline rounded-2xl p-6 md:p-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-landing-accent-soft flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-landing-accent" aria-hidden="true" />
                  </div>
                  <span className="text-base text-landing-text">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

function FAQSection({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <section className="py-16 md:py-20 bg-landing-surface border-b border-landing-border/50">
      <div className="max-w-3xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Everything you need to know about this service.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll>
          <ServiceFAQ items={items} />
        </AnimateOnScroll>
      </div>
    </section>
  );
}

function RelatedServices({
  currentId,
  slugs,
}: {
  currentId: string;
  slugs: string[];
}) {
  const related = getRelatedServices(slugs, currentId);
  if (related.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-landing-surface-card border-b border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-landing-text tracking-tight leading-tight">
            Related services
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Explore other services that may be relevant to your needs.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((service) => (
            <AnimateOnScroll key={service.title}>
                <Link
                  href={service.link}
                  className="group card-hairline block rounded-2xl p-6 h-full transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-landing-accent-soft flex items-center justify-center text-landing-accent mb-4">
                    <service.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-semibold text-landing-text mb-2 group-hover:text-landing-brand transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-landing-text-muted leading-relaxed line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-landing-brand mt-4 group-hover:gap-2 transition-all">
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="grain relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-landing-surface to-landing-accent-soft">
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-16 text-center">
        <AnimateOnScroll>
          <h2 className="text-2xl md:text-4xl font-semibold text-landing-text text-balance tracking-tight leading-[1.2]">
            Ready to take the next step?
          </h2>
          <p className="mt-4 text-lg text-landing-text-muted leading-relaxed text-balance">
            Book an appointment with Dr. Bubal Care today and receive trusted,
            evidence-based healthcare guidance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 bg-landing-brand text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 active:scale-[0.98] transition-all duration-200 shadow-soft"
            >
              Book a consultation
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 border border-landing-border text-landing-text bg-landing-surface-card px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-landing-surface-muted transition-colors duration-200"
            >
              Contact us
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}

export function ServicePageTemplate({
  content,
  jsonLd,
}: {
  content: ServicePageContent;
  jsonLd?: Record<string, unknown>;
}) {
  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <HeroSection content={content} />
      <Introduction content={content} />
      <WhoCanBenefit content={content} />
      <WhatWeOffer content={content} />
      <HowItWorks steps={content.howItWorks} />
      <RequiredDocuments documents={content.requiredDocuments} />
      <FAQSection items={content.faqs} />
      <RelatedServices currentId={content.id} slugs={content.relatedServices} />
      <FinalCTA />
    </>
  );
}
