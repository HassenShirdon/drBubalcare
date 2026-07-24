import { MessageCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-evidence-blue-light/20 border-y border-surface-gray/50 animate-gradient">
      <div className="max-w-7xl mx-auto px-6 md:px-16 text-center space-y-5">
        <h2 className="font-headline-lg text-2xl md:text-3xl font-semibold text-text-medical-black text-balance">
          Don&apos;t wait for answers
        </h2>
        <p className="font-body-lg text-sm text-on-surface-variant/80 max-w-xl mx-auto">
          Your specialist opinion is 24-48 hours away. Upload your records now and get the clarity you deserve.
        </p>
        <div className="flex justify-center gap-3 pt-1 flex-wrap">
          <button className="bg-clinical-navy text-white text-sm font-medium px-8 py-3.5 rounded-xl hover:bg-primary-container transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2">
            Start Your Case Now →
          </button>
          <a href="#contact" className="inline-flex items-center gap-2 text-healing-teal font-medium hover:underline">
            <MessageCircle className="w-4 h-4" />
            Questions? Chat with us
          </a>
        </div>
        <p className="text-xs text-on-surface-variant/70 mt-4">
          ✓ No credit card required · ✓ Cancel anytime · ✓ 100% confidential
        </p>
      </div>
    </section>
  )
}
