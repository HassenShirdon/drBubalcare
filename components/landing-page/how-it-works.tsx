import { STEPS } from '@/components/landing-page/data';
import { AnimateOnScroll } from './animate-on-scroll';

export default function HowItWorks() {
  return (
    <AnimateOnScroll>
      <section
        id="how-it-works"
        className="py-16 bg-surface border-b border-surface-gray/50"
      >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            Get answers in 3 simple steps
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            No travel. No waiting rooms. Just upload, relax, and get specialist answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-clinical-navy/20" />
          {STEPS.map((step) => (
            <div key={step.num} className="relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-healing-teal flex items-center justify-center text-white font-headline-md font-semibold text-sm mx-auto md:mx-0 relative z-10">
                {step.num}
              </div>
              <div className="mt-3">
                <h3 className="font-headline-md text-sm font-semibold text-clinical-navy mb-1.5">
                  {step.title}
                </h3>
                <p className="font-body-md text-on-surface-variant/80 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-clinical-navy text-white rounded-xl px-8 py-3.5 font-medium shadow-lg hover:shadow-xl transition-shadow">
            Start Your Case Now →
          </button>
        </div>
      </div>
      </section>
    </AnimateOnScroll>
  );
}
