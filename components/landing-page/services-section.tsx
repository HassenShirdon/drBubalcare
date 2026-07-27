import Link from "next/link";
import { SERVICES } from '@/components/landing-page/data'
import { AnimateOnScroll } from './animate-on-scroll'

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <AnimateOnScroll className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#15803D]">
            Services
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0F172A] text-balance">
            Choose the level of support you need
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {SERVICES.map((service) => (
            <AnimateOnScroll key={service.title}>
              <div className="bg-white rounded-2xl p-7 border-l-4 border-l-[#1E3A5F] border-y border-r border-[#E2E8F0]/60 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1E3A5F] mb-4">
                  <service.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                  {service.title}
                </h3>
                <p className="text-base text-[#64748B]/85 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <p className="text-base font-semibold text-[#1E3A5F] mt-4">
                  {service.price}
                </p>
                <Link
                  href="/patient"
                  className="mt-4 inline-flex items-center text-base font-semibold text-[#1E3A5F] hover:text-[#1E3A5F] transition-colors"
                >
                  Learn more <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}