import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]/50">
      <div className="max-w-3xl mx-auto px-6 md:px-16 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0F172A] text-balance">
          Get clarity on your diagnosis
        </h2>
        <p className="font-body-lg text-lg text-[#64748B]/80">
          Upload your records and a board-certified specialist will return a written opinion in 24–48 hours.
        </p>
        <div className="flex justify-center gap-3 pt-2 flex-wrap">
          <Link
            href="/patient"
            className="bg-[#1E3A5F] text-white text-base font-medium px-8 py-3.5 rounded-lg hover:bg-primary transition-colors inline-flex items-center gap-2"
          >
            Start your case
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 border border-[#E2E8F0] text-[#0F172A] bg-white px-6 py-3.5 rounded-lg text-base font-medium hover:bg-[#F1F5F9]/50 transition-colors"
          >
            Contact us
          </Link>
        </div>
        <p className="text-sm text-[#64748B]/70 mt-4">
          No credit card required to start · Cancel anytime · Encrypted and confidential
        </p>
      </div>
    </section>
  )
}
