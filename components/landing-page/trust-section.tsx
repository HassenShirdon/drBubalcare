import { TRUST_POINTS } from '@/components/landing-page/data';
import { TrustChecklist } from './trust-checklist';
import { AnimateOnScroll } from './animate-on-scroll';

export default function TrustSection() {
  return (
    <AnimateOnScroll>
      <section id="about" className="py-20 md:py-28 bg-white border-y border-surface-gray/50">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-healing-teal">
                Privacy & Security
              </p>
              <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-semibold text-text-medical-black leading-tight text-balance">
                Built around patient privacy from day one.
              </h2>
            </div>

            <div className="space-y-6">
              {TRUST_POINTS.map((point) => (
                <div key={point.question} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mt-0.5">
                    <point.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg font-semibold text-text-medical-black mb-1">
                      {point.question}
                    </h3>
                    <p className="font-body-md text-base text-on-surface-variant/85 leading-relaxed">
                      {point.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <TrustChecklist />
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}