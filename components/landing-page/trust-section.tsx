'use client';

import { motion } from 'motion/react';
import { TRUST_POINTS } from '@/components/landing-page/data';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
} as const;

export default function TrustSection() {
  return (
    <motion.section
      id="about"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="py-16 bg-white border-y border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black leading-tight text-balance">
              Why patients trust Dr. Bubal Care
            </h2>
            <p className="font-body-lg text-sm text-on-surface-variant leading-relaxed">
              We don&apos;t replace your doctor. We help you understand your results —
              clearly, quickly, and securely.
            </p>

            <div className="space-y-4 pt-4 border-t border-surface-gray/50">
              {TRUST_POINTS.map((point) => (
                <div key={point.title} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-container-low border border-surface-gray flex items-center justify-center text-healing-teal mt-0.5">
                    <point.icon />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-sm font-semibold text-clinical-navy mb-0.5">
                      {point.title}
                    </h3>
                    <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-square border border-surface-gray/50">
            <div className="w-full h-full bg-gradient-to-br from-clinical-navy/10 to-healing-teal/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}