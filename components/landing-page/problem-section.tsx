'use client'

import { motion } from 'motion/react'
import { Users, Plane, Clock } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const cards = [
  {
    icon: Users,
    stat: '1 specialist per 100,000+ people',
    description:
      "Most hospitals in the region don't have a single board-certified pathologist or radiologist on staff.",
  },
  {
    icon: Plane,
    stat: 'Avg. 6-8 hours travel',
    description:
      'Patients and their families travel for hours — sometimes across borders — just to get a second opinion.',
  },
  {
    icon: Clock,
    stat: 'Weeks to months wait',
    description:
      "By the time results reach a specialist, critical time has been lost. Early detection shouldn't be a luxury.",
  },
]

export default function ProblemSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className="py-16 bg-white border-y border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            The gap between test and answer
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            In East Africa, getting a specialist opinion shouldn&apos;t require
            a plane ticket.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.stat}
              variants={fadeInUp}
              className="bg-white rounded-2xl p-6 border border-surface-gray/60 shadow hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-healing-teal/10 flex items-center justify-center text-healing-teal mb-4">
                <card.icon className="w-5 h-5" />
              </div>
              <p className="font-headline-md text-2xl font-bold text-clinical-navy mb-2">
                {card.stat}
              </p>
              <p className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
