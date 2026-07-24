"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, Lock, Award, ArrowDown } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
} as const;

const itemFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
} as const;


export default function HeroSection() {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden pt-28 pb-24 px-6 md:px-16 min-h-[78vh] flex items-center justify-center bg-gradient-to-b from-surface via-surface to-evidence-blue-light/40"
    >
      {/* Decorative background — subtle color wash */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-evidence-blue-light/15 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-healing-teal/5 blur-3xl -z-10"
      />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto space-y-7"
        >
          {/* Headline — balanced two-line rhythm */}
          <motion.h1
            variants={itemFade}
            className="font-headline-md text-3xl md:text-5xl text-clinical-navy font-semibold leading-[1.15] text-balance"
          >
            Waiting weeks for a specialist opinion?
          </motion.h1>

          <motion.p
            variants={itemFade}
            className="font-body-lg text-base md:text-lg text-on-surface-variant/80 max-w-2xl"
          >
            Whether your lab results need interpretation or your biopsy needs a second look — get board-certified specialist answers in 24-48 hours, not weeks.
          </motion.p>

          {/* CTAs — primary blue, secondary teal outline */}
          <motion.div
            variants={itemFade}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-medium px-8 py-3.5 rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-xl"
            >
              Get Your Results Reviewed
              <span aria-hidden="true">&rarr;</span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-healing-teal/40 text-healing-teal hover:bg-healing-teal/5 text-sm font-medium px-7 py-3.5 rounded-xl transition-all"
            >
              See How It Works
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              24-48h Turnaround
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              100% Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Board-Certified
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
