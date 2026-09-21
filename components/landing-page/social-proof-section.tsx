import { Star } from "lucide-react";
import { TESTIMONIALS } from "./data";
import { AnimateOnScroll } from "./animate-on-scroll";

const badges = [
  "Physicians of the Global Doctors Network",
  "Encrypted Uploads",
  "HIPAA-Aware Processes",
] as const;

export function SocialProofSection() {
  return (
    <section className="bg-landing-surface py-20 md:py-28 border-y border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <AnimateOnScroll className="max-w-2xl mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text tracking-tight leading-[1.2] text-balance">
            Real clarity from real patients
          </h2>
          <p className="mt-3 text-lg text-landing-text-muted leading-relaxed">
            Patients across East Africa share their experience with Dr. Bubal
            Care.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TESTIMONIALS.map((testimonial) => (
            <AnimateOnScroll key={testimonial.name}>
              <div className="card-hairline rounded-2xl p-6 md:p-8 flex h-full flex-col">
                <div
                  className="flex gap-0.5 mb-4"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={`star-${j}`}
                      className="w-4 h-4 fill-landing-accent text-landing-accent"
                    />
                  ))}
                </div>
                <blockquote className="text-base text-landing-text-muted leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer className="pt-4 border-t border-landing-border/70 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-landing-accent-soft text-xs font-semibold text-landing-accent"
                    aria-hidden="true"
                  >
                    {testimonial.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-landing-text leading-tight">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-landing-text-faint">
                      {testimonial.location}
                    </p>
                  </div>
                </footer>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <AnimateOnScroll key={badge}>
              <span className="inline-flex items-center gap-2 bg-landing-surface-card border border-landing-border/60 rounded-lg px-4 py-2.5 text-sm font-medium text-landing-text-muted">
                <span
                  className="w-2 h-2 rounded-full bg-landing-success"
                  aria-hidden="true"
                />
                {badge}
              </span>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
