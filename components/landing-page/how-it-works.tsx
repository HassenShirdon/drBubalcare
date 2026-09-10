import Link from "next/link";
import { STEPS } from "@/components/landing-page/data";
import { AnimateOnScroll } from "./animate-on-scroll";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 bg-card border-y border-landing-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text tracking-tight leading-[1.2] text-balance">
            Upload once. Reviewed by a physician from our Global Doctors Network.
            <br />
            Receive your written opinion.
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div
            className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-landing-brand/15"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <AnimateOnScroll
              key={step.title}
              className="relative text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-landing-accent flex items-center justify-center text-landing-brand mx-auto md:mx-0 relative z-10">
                <step.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="mt-5">
                <h3 className="text-lg font-semibold text-landing-text mb-2">
                  {step.title}
                </h3>
                <p className="text-landing-text-muted leading-relaxed text-base">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/patient"
            className="inline-flex items-center justify-center bg-landing-brand text-white rounded-xl px-8 py-3.5 text-base font-semibold hover:bg-landing-brand/90 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-landing-brand/20"
          >
            Start a Case
          </Link>
        </div>
      </div>
    </section>
  );
}
