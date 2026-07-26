import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-surface border-y border-surface-gray/50">
      <div className="max-w-3xl mx-auto px-6 md:px-16 text-center space-y-6">
        <h2 className="font-headline-lg text-3xl md:text-4xl font-semibold text-text-medical-black text-balance">
          Get clarity on your diagnosis
        </h2>
        <p className="font-body-lg text-lg text-on-surface-variant/80">
          Upload your records and a board-certified specialist will return a written opinion in 24–48 hours.
        </p>
        <div className="flex justify-center gap-3 pt-2 flex-wrap">
          <Link
            href="/patient"
            className="bg-clinical-navy text-white text-base font-medium px-8 py-3.5 rounded-lg hover:bg-primary transition-colors inline-flex items-center gap-2"
          >
            Start your case
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 border border-surface-gray text-text-medical-black bg-white px-6 py-3.5 rounded-lg text-base font-medium hover:bg-surface-gray/50 transition-colors"
          >
            Contact us
          </Link>
        </div>
        <p className="text-sm text-on-surface-variant/70 mt-4">
          No credit card required to start · Cancel anytime · Encrypted and confidential
        </p>
      </div>
    </section>
  )
}
