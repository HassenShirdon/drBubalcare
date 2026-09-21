import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="grain relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-landing-surface to-landing-accent-soft border-y border-landing-border/50">
      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-16 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text text-balance tracking-tight leading-[1.2]">
          Ready to understand your results?
        </h2>
        <p className="mt-4 text-lg text-landing-text-muted leading-relaxed text-balance">
          Upload your records today. A board-certified doctor from our Global
          Doctors Network will review your case and deliver clear answers.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/patient"
            className="inline-flex items-center gap-2 bg-landing-brand text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 active:scale-[0.98] transition-all duration-200 shadow-soft"
          >
            Start a case
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 border border-landing-border text-landing-text bg-landing-surface-card px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-landing-surface-muted transition-colors duration-200"
          >
            Contact us
          </Link>
        </div>
        <p className="mt-6 text-sm text-landing-text-faint">
          No credit card required. Encrypted and confidential.
        </p>
      </div>
    </section>
  );
}
