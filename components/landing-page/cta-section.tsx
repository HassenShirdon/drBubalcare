import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-evidence-blue-light/20 border-y border-surface-gray/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 text-center space-y-5">
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-text-medical-black text-balance">
          Ready to connect with a specialist?
        </h2>
        <p className="font-body-lg text-sm text-on-surface-variant/80 max-w-xl mx-auto">
          Upload your records or book a consultation. A board-certified specialist
          will review your case and deliver clear answers.
        </p>
        <div className="flex justify-center gap-3 pt-1 flex-wrap">
          <Link
            href="/patient"
            className="bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm inline-flex items-center gap-2"
          >
            Start a Case <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#contact"
            className="border border-clinical-navy/20 text-clinical-navy text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-evidence-blue-light transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
