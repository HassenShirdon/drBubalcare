import { TRUST_POINTS } from "@/components/landing-page/data";
import { TrustChecklist } from "./trust-checklist";
import { AnimateOnScroll } from "./animate-on-scroll";

export default function TrustSection() {
  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-card border-y border-landing-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <AnimateOnScroll className="space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text leading-tight text-balance">
                Why patients trust Dr. Bubal Care
              </h2>
              <p className="text-lg text-landing-text-muted leading-relaxed max-w-lg">
                We do not replace your doctor. We help you understand your
                results. Clearly, quickly, and securely.
              </p>
            </AnimateOnScroll>

            <div className="space-y-6">
              {TRUST_POINTS.map((point, i) => (
                <AnimateOnScroll key={point.title}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-landing-accent flex items-center justify-center text-landing-brand mt-0.5">
                      <point.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-landing-text mb-1">
                        {point.title}
                      </h3>
                      <p className="text-base text-landing-text-muted leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <AnimateOnScroll>
              <TrustChecklist />
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
