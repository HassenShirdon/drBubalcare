'use client'

import { motion } from 'motion/react'
import { SERVICES } from '@/components/landing-page/data'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function ServicesSection() {
  return (
    <motion.section
      id="services"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className="py-16 bg-surface border-b border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            How we help you
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            From one-time opinions to ongoing monitoring — find the right service for your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeInUp}
              className={`bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300 group flex flex-col h-full ${
                service.category === "Most Popular"
                  ? "border-t-4 border-clinical-navy"
                  : "border-t-4 border-healing-teal/20"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy mb-4 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-300">
                <service.icon className="w-5 h-5" />
              </div>
              {service.category === "Most Popular" && (
                <span className="inline-block bg-healing-teal/10 text-healing-teal rounded-full px-3 py-0.5 text-xs font-medium mb-2 self-start">
                  Most Popular
                </span>
              )}
              <h3 className="font-headline-md text-base font-semibold text-clinical-navy mb-2 group-hover:text-healing-teal transition-colors duration-300">
                {service.title}
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/80 flex-grow">
                {service.description}
              </p>
              <p className="font-headline-md text-sm font-semibold text-clinical-navy mt-3">
                {service.price}
              </p>
              <button className="mt-4 bg-clinical-navy text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-container transition-colors self-start">
                Get Started →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}