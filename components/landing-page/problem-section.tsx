import { AnimateOnScroll } from "./animate-on-scroll";

const problems = [
  {
    stat: "1",
    unit: "specialist",
    context: "per 100,000+ patients in parts of East Africa",
  },
  {
    stat: "6+",
    unit: "hours",
    context: "average travel time to reach a specialist clinic",
  },
  {
    stat: "Weeks",
    unit: "",
    context: "to months waiting for an appointment in many regions",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-healing-teal mb-3">
            The challenge
          </p>
          <h2 className="font-headline-md text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-medical-black tracking-tight leading-[1.2] text-balance">
            Specialist care is out of reach for too many patients.
          </h2>
        </AnimateOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <AnimateOnScroll key={problem.context}>
              <div className="border-t-2 border-clinical-navy pt-5">
                <p className="font-headline-md text-5xl font-bold text-text-medical-black">
                  {problem.stat}
                  {problem.unit && (
                    <span className="text-xl font-semibold text-on-surface-variant ml-1">
                      {problem.unit}
                    </span>
                  )}
                </p>
                <p className="mt-3 font-body-md text-base text-on-surface-variant/85 leading-relaxed">
                  {problem.context}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
