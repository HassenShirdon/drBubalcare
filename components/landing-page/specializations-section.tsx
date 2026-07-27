import { SPECIALIZATIONS } from '@/components/landing-page/data'
import { AnimateOnScroll } from './animate-on-scroll'

export default function SpecializationsSection() {
  return (
    <section id="specializations" className="py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <AnimateOnScroll className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#15803D]">
            Specializations
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0F172A] text-balance">
            Covered by board-certified specialists
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SPECIALIZATIONS.map((spec) => (
            <AnimateOnScroll key={spec.title}>
              <div className="bg-white rounded-2xl p-7 border border-[#E2E8F0]/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-[#1E3A5F]/10 text-[#1E3A5F]">
                  <spec.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  {spec.title}
                </h3>
                <p className="text-base text-[#64748B]/85 leading-relaxed">
                  {spec.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
