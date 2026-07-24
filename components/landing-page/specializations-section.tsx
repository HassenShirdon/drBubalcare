'use client'

import { motion } from 'motion/react'
import { SPECIALIZATIONS } from '@/components/landing-page/data'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function SpecializationsSection() {
  return (
    <motion.section
      id="specializations"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="py-16 bg-white border-y border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            Expert care across every specialty
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            From hematology to radiology — our specialists cover the disciplines that matter most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SPECIALIZATIONS.map((spec, index) => (
            <motion.div
              key={spec.title}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${
                  index % 2 === 0
                    ? 'bg-clinical-navy/10 text-clinical-navy'
                    : 'bg-healing-teal/10 text-healing-teal'
                }`}
              >
                <spec.icon className="w-6 h-6" />
              </div>
              <h3 className="font-headline-md text-sm font-semibold text-clinical-navy mb-1">
                {spec.title}
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
                {spec.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <a href="#specializations" className="text-healing-teal font-medium hover:underline">
            View All Specialties →
          </a>
        </div>
      </div>
    </motion.section>
  )
}
