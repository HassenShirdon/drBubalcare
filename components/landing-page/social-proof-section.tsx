import { Star, Shield, Award } from "lucide-react";
import { TESTIMONIALS, SPECIALISTS } from "./data";
import { AnimateOnScroll } from "./animate-on-scroll";

export function SocialProofSection() {
  return (
    <section className="bg-surface py-16 md:py-24 border-y border-surface-gray/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="text-center mb-12">
          <h2 className="font-headline-md text-2xl md:text-3xl text-text-clinical-navy font-semibold mb-4">
            Trusted by patients and specialists worldwide
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((testimonial) => (
            <AnimateOnScroll key={testimonial.name}>
              <div className="bg-white rounded-2xl p-6 border border-surface-gray shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={`star-${j}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-body-md text-sm italic text-on-surface-variant mb-4">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <p className="font-headline-md text-sm font-semibold text-clinical-navy">
                    {testimonial.name}
                  </p>
                  <p className="font-body-md text-xs text-on-surface-variant/70">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {SPECIALISTS.map((specialist) => (
            <AnimateOnScroll key={specialist.name}>
              <div className="text-center">
                <div className="w-[120px] h-[120px] rounded-full bg-surface-gray mx-auto mb-3 grayscale hover:grayscale-0 transition-all duration-300" />
                <p className="font-headline-md text-sm font-semibold text-clinical-navy">
                  {specialist.name}
                </p>
                <p className="font-body-md text-xs text-on-surface-variant/70">
                  {specialist.specialty}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "HIPAA Compliant", icon: Shield, id: "hipaa" },
            { label: "GDPR Certified", icon: Award, id: "gdpr" },
            { label: "Board-Certified Specialists", icon: Award, id: "board" },
          ].map((badge) => (
            <AnimateOnScroll key={badge.id}>
              <span className="inline-flex items-center gap-1.5 bg-surface-container-low border border-surface-gray rounded-full px-4 py-1.5 text-xs font-medium text-clinical-navy">
                <badge.icon className="w-3.5 h-3.5" />
                {badge.label}
              </span>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}