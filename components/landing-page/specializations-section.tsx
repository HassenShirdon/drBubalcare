import { SPECIALIZATIONS } from "@/components/landing-page/data";
import { AnimateOnScroll } from "./animate-on-scroll";

export default function SpecializationsSection() {
  return (
    <section
      id="specializations"
      className="py-20 md:py-28 bg-landing-surface border-y border-landing-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text tracking-tight leading-[1.2] text-balance">
            Covered by the Global Doctors Network
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Board-certified expertise across 10 medical disciplines, wherever
            you are.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {SPECIALIZATIONS.map((spec) => (
            <AnimateOnScroll key={spec.title}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-landing-border/60 p-5 text-center transition-colors duration-200 hover:border-landing-brand/30 hover:bg-landing-surface-card">
                <div className="mb-3 flex w-10 h-10 items-center justify-center rounded-xl bg-landing-accent-soft text-landing-accent">
                  <spec.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-landing-text mb-1">
                  {spec.title}
                </h3>
                <p className="text-xs text-landing-text-faint leading-relaxed line-clamp-2">
                  {spec.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
