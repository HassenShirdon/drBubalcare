'use client'

import { motion } from 'motion/react'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const nodes = [
  {
    stat: '1 specialist per 100,000+',
    description:
      'Most communities \u2014 rich or poor \u2014 lack board-certified specialists nearby. In Sub-Saharan Africa, the ratio is 1:1,000,000. Even in the US, rural counties average 1 specialist per 50,000+.',
  },
  {
    stat: '6+ hours avg. travel',
    description:
      "Patients travel for hours \u2014 sometimes across borders \u2014 just for a consultation. In developing nations, it's days. In the US, rural patients drive 4x further than urban peers.",
  },
  {
    stat: 'Weeks to months wait',
    description:
      "By the time you get an appointment, critical time has been lost. Specialist access shouldn't be a luxury \u2014 but everywhere, it is.",
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
      className="py-20 bg-white"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-16">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto space-y-3 mb-16"
        >
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            Getting specialist care shouldn&apos;t be this hard
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            Whether you&apos;re in Nairobi or New York, seeing a specialist
            means travel, long waits, and uncertainty.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-surface-gray/60 -translate-x-1/2" />

          <div className="space-y-12">
            {nodes.map((node, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={node.stat}
                  variants={fadeInUp}
                  className={`relative flex items-start gap-8 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`hidden md:block md:w-1/2 ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <p className="font-headline-md text-3xl font-bold text-clinical-navy mb-2">
                      {node.stat}
                    </p>
                    <p className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed">
                      {node.description}
                    </p>
                  </div>

                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-healing-teal ring-4 ring-white z-10 mt-1" />

                  <div className="md:hidden pl-10">
                    <p className="font-headline-md text-3xl font-bold text-clinical-navy mb-2">
                      {node.stat}
                    </p>
                    <p className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
