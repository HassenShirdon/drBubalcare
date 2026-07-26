import Link from "next/link";
import { STEPS } from '@/components/landing-page/data';
import { AnimateOnScroll } from './animate-on-scroll';

export default function HowItWorks() {
  return (
    <AnimateOnScroll>
        <section
          id="how-it-works"
          className="py-20 bg-white border-b border-surface-gray/50"
        >
        <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-healing-teal">
              How It Works
            </p>
            <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-semibold text-text-medical-black text-balance">
              Upload once. Review by a specialist. Receive your written opinion.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-clinical-navy/15" aria-hidden="true" />
            {STEPS.map((step) => (
              <div key={step.num} className="relative text-center md:text-left">
                <div className="w-12 h-12 rounded-full bg-clinical-navy flex items-center justify-center text-white font-headline-md font-semibold text-base mx-auto md:mx-0 relative z-10">
                  {step.num}
                </div>
                <div className="mt-5">
                  <h3 className="font-headline-md text-lg font-semibold text-text-medical-black mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant/85 leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/patient"
              className="inline-flex items-center justify-center bg-clinical-navy text-white rounded-lg px-8 py-3.5 text-base font-medium hover:bg-primary transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
