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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SPECIALIZATIONS.map((spec, i) => {
            const bgClasses = [
              "bg-landing-accent",
              "bg-landing-success/20",
              "bg-landing-accent",
              "bg-landing-success/20",
              "bg-landing-accent",
            ];
            const iconColors = [
              "text-landing-brand",
              "text-landing-success",
              "text-landing-brand",
              "text-landing-success",
              "text-landing-brand",
            ];

            return (
              <AnimateOnScroll key={spec.title}>
                <div className="bg-card rounded-2xl p-6 border border-landing-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      bgClasses[i % bgClasses.length]
                    } ${iconColors[i % iconColors.length]}`}
                  >
                    <spec.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-landing-text mb-1">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-landing-text-faint leading-relaxed line-clamp-2">
                    {spec.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
