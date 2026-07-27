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
    <section className="py-20 md:py-28 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#15803D] mb-3">
            The challenge
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F172A] tracking-tight leading-[1.2] text-balance">
            Specialist care is out of reach for too many patients.
          </h2>
        </AnimateOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <AnimateOnScroll key={problem.context}>
              <div className="border-t-2 border-[#1E3A5F] pt-5">
                <p className="text-3xl font-bold text-[#0F172A]">
                  {problem.stat}
                  {problem.unit && (
                    <span className="text-xl font-semibold text-[#64748B] ml-1">
                      {problem.unit}
                    </span>
                  )}
                </p>
                <p className="mt-3 text-base text-[#64748B]/85 leading-relaxed">
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
