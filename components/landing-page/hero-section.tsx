'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
} as const;

export default function HeroSection() {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative pt-32 pb-20 px-6 md:px-16 min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-surface to-evidence-blue-light/20"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-healing-teal/5 blur-3xl -z-10" />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="font-headline-md text-4xl md:text-5xl text-text-medical-black tracking-tight font-semibold leading-tight text-balance">
            World-class specialists.
            <br />
            One platform.
          </h1>

          <p className="font-body-lg text-base md:text-lg text-on-surface-variant/80 leading-relaxed max-w-xl mx-auto">
            Connect with board-certified specialists for lab reviews, second
            opinions, and consultations. Clear answers, from your phone.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm"
            >
              Start a Case
              <span aria-hidden="true">&rarr;</span>
            </Link>

            <a
              href="#how-it-works"
              className="text-on-surface-variant hover:text-clinical-navy transition-colors text-sm font-medium"
            >
              How It Works &darr;
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
