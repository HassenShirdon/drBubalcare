import { Star, Shield, Award, Lock } from "lucide-react";
import { TESTIMONIALS } from "./data";
import { AnimateOnScroll } from "./animate-on-scroll";

const badges = [
  { label: "Board-Certified Specialists", icon: Award, id: "board" },
  { label: "Encrypted Uploads", icon: Lock, id: "encrypted" },
  { label: "HIPAA-Aware Processes", icon: Shield, id: "hipaa" },
];

export function SocialProofSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-28 border-y border-[#E2E8F0]/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#3B82F6] mb-3">
            Patient Stories
          </p>
          <h2 className="text-2xl md:text-3xl text-[#0F172A] font-semibold tracking-tight leading-tight">
            Real clarity from real patients
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TESTIMONIALS.map((testimonial) => (
            <AnimateOnScroll key={testimonial.name}>
              <div className="bg-white rounded-2xl p-7 border border-[#E2E8F0] shadow-sm h-full flex flex-col">
                <div className="flex gap-0.5 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={`star-${j}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-base text-[#64748B]/90 leading-relaxed mb-5 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer>
                  <p className="text-base font-semibold text-[#0F172A]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#64748B]/70">
                    {testimonial.location}
                  </p>
                </footer>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <AnimateOnScroll key={badge.id}>
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-medium text-[#64748B]">
                <badge.icon className="w-4 h-4 text-[#1E3A5F]" aria-hidden="true" />
                {badge.label}
              </span>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}