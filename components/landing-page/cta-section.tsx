import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-landing-surface to-landing-accent/30 border-y border-landing-border/50">
      <div className="max-w-2xl mx-auto px-6 md:px-16 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold text-landing-text text-balance tracking-tight leading-[1.2]">
          Ready to understand your results?
        </h2>
        <p className="mt-4 text-lg text-landing-text-muted leading-relaxed text-balance">
          Upload your records today. A board-certified specialist will review
          your case and deliver clear answers.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/patient"
            className="inline-flex items-center gap-2 bg-landing-brand text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-landing-brand/90 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-landing-brand/20"
          >
            Start a Case
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 border border-landing-border text-landing-text bg-card px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-landing-surface-muted transition-colors duration-200"
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
