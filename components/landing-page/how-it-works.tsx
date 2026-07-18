'use client';

import { motion } from 'motion/react';
import { STEPS } from '@/components/landing-page/data';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
} as const;

export default function HowItWorks() {
  return (
    <motion.section
      id="how-it-works"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="py-16 bg-surface border-b border-surface-gray/50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-headline-lg text-2xl md:text-3xl lg:text-4xl font-semibold text-text-medical-black text-balance">
            How it works
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80">
            From first contact to specialist answers — we handle the coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-clinical-navy/10" />
          {STEPS.map((step) => (
            <div key={step.num} className="relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-evidence-blue-light flex items-center justify-center text-clinical-navy font-headline-md font-semibold text-sm mx-auto md:mx-0 relative z-10">
                {step.num}
              </div>
              <div className="mt-3">
                <h3 className="font-headline-md text-sm font-semibold text-clinical-navy mb-1.5">
                  {step.title}
                </h3>
                <p className="font-body-md text-on-surface-variant/80 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
