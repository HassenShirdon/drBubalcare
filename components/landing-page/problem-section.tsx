import { ChevronDown } from "lucide-react";
import { AnimateOnScroll } from "./animate-on-scroll";

const cards = [
  {
    title: "The Access Gap",
    description:
      "1 specialist per 100,000+ patients in many regions. Your local doctor may never see your condition before.",
  },
  {
    title: "The Travel Burden",
    description:
      "6+ hours average travel to reach a specialist. Families sacrifice work, savings, and time for a single consultation.",
  },
  {
    title: "The Wait",
    description:
      "Weeks to months for an appointment. Meanwhile, anxiety builds and treatment delays compound.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-surface via-surface to-surface-gray/50">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16">
        <AnimateOnScroll className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-healing-teal mb-3">
            The Challenge
          </p>
          <h2 className="font-headline-md text-2xl sm:text-3xl lg:text-[2.75rem] font-semibold text-text-medical-black tracking-tight leading-[1.2] text-balance">
            The specialist care gap is{" "}
            <span className="text-clinical-navy">real</span>.
          </h2>
          <p className="mt-5 font-body-lg text-sm md:text-base text-on-surface-variant/85 leading-relaxed max-w-lg mx-auto">
            Patients in underserved regions face impossible choices: travel for
            hours, wait for months, or go without expert answers.
          </p>
        </AnimateOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <AnimateOnScroll key={card.title}>
              <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm border border-surface-gray p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? "bg-clinical-navy" : i === 1 ? "bg-healing-teal" : "bg-primary"}`}
                />
                <p className="font-headline-md text-lg font-semibold text-text-medical-black mb-2 leading-tight">
                  {card.title}
                </p>
                <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <p className="text-sm font-semibold text-healing-teal">
            There&apos;s a better way
          </p>
          <ChevronDown className="w-4 h-4 text-healing-teal animate-bounce" />
        </div>
      </div>
    </section>
  );
}
