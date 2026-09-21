import Link from "next/link";
import { SERVICES } from "@/components/landing-page/data";
import { AnimateOnScroll } from "./animate-on-scroll";
import { ArrowRight, Check } from "lucide-react";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-landing-surface-card border-y border-landing-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text tracking-tight leading-[1.2] text-balance">
            Our services
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Providing evidence-based health care solutions, expert medical
            guidance, personalized nutrition, and patient education to help you
            make informed healthcare decisions.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <AnimateOnScroll key={service.title}>
              <div className="card-hairline group flex h-full flex-col rounded-2xl p-6 transition-all duration-200 md:p-8 hover:shadow-lift">
                <div className="w-11 h-11 rounded-xl bg-landing-accent-soft flex items-center justify-center text-landing-accent mb-4">
                  <service.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-landing-text mb-2 group-hover:text-landing-brand transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-landing-text-muted leading-relaxed mb-5 flex-grow">
                  {service.shortDescription}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-landing-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-landing-text">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.link}
                  className="inline-flex items-center justify-center gap-2 w-full text-sm font-semibold px-5 py-2.5 rounded-xl bg-landing-brand text-white hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 active:scale-[0.98] transition-all duration-200 shadow-soft"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll className="mt-16 md:mt-20">
          <div className="rounded-2xl border border-landing-border/60 bg-landing-accent-soft p-8 md:p-10 text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-landing-text tracking-tight">
              Need help choosing the right service?
            </h3>
            <p className="mt-3 text-base text-landing-text-muted leading-relaxed max-w-xl mx-auto">
              Not sure which healthcare service best fits your needs? Our
              healthcare professionals are ready to guide you toward the right
              care.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/patient"
                className="inline-flex items-center gap-2 bg-landing-brand text-white text-base font-semibold px-7 py-3 rounded-xl hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 active:scale-[0.98] transition-all duration-200 shadow-soft"
              >
                Book a consultation
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 border border-landing-border text-landing-text bg-landing-surface-card px-6 py-3 rounded-xl text-base font-semibold hover:bg-landing-surface-muted transition-colors duration-200"
              >
                Contact us
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
