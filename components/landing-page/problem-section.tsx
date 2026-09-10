import { PROBLEMS } from "@/components/landing-page/data";
import { AnimateOnScroll } from "./animate-on-scroll";

export default function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-landing-surface">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text tracking-tight leading-[1.2] text-balance">
            The gap between test and answer.
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            In East Africa, getting an expert opinion from our Global Doctors
            Network should not require a plane ticket.
          </p>
        </AnimateOnScroll>

        <div className="grid gap-8 md:grid-cols-3">
          {PROBLEMS.map((problem, i) => (
            <AnimateOnScroll key={problem.label}>
              <div className="bg-card rounded-2xl p-7 border border-landing-border/60 shadow-sm h-full">
                <div className="w-12 h-12 rounded-xl bg-landing-accent flex items-center justify-center text-landing-brand mb-5">
                  <problem.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-landing-brand leading-none">
                    {problem.stat}
                  </span>
                  <span className="text-sm font-medium text-landing-text-faint">
                    {problem.label}
                  </span>
                </div>
                <p className="text-landing-text-muted leading-relaxed text-base">
                  {problem.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
