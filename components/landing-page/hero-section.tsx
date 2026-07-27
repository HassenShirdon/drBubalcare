"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, Quote } from "lucide-react";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const stagger = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
        },
      };

  const itemFade = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" as const },
        },
      };

  return (
    <section id="home" className="relative overflow-hidden pt-16 md:pt-24 pb-16 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#DBEAFE]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#DCFCE7]/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={itemFade}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E3A5F]/5 border border-[#1E3A5F]/10 text-sm font-medium text-[#1E3A5F] mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#15803D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#15803D]" />
            </span>
            Now serving Kenya, Uganda, and Tanzania
          </motion.div>

          <motion.h1
            variants={itemFade}
            className="text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] font-bold leading-[1.15] tracking-tight text-balance max-w-3xl"
          >
            A specialist opinion on your diagnosis,{" "}
            <span className="text-[#3B82F6]">without the wait.</span>
          </motion.h1>

          <motion.p
            variants={itemFade}
            className="mt-6 text-lg md:text-xl text-[#64748B]/85 max-w-2xl leading-relaxed"
          >
            Upload your records. A board-certified pathologist, radiologist,
            or oncologist reviews your case and returns a plain-language
            written opinion in <span className="font-semibold text-[#0F172A]">24–48 hours</span>.
          </motion.p>

          <motion.div
            variants={itemFade}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white text-base font-semibold px-8 py-3.5 rounded-lg hover:bg-[#1E3A5F]/90 transition-colors duration-200 shadow-sm shadow-[#1E3A5F]/20"
            >
              Get a specialist opinion
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-[#1E3A5F] hover:text-[#3B82F6] text-base font-semibold px-4 py-3.5 transition-colors duration-200"
            >
              See how it works
            </Link>
          </motion.div>

          <motion.div
            variants={itemFade}
            className="mt-12 pt-8 border-t border-[#E2E8F0] w-full max-w-lg relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F8FAFC] px-3">
              <Quote className="w-5 h-5 text-[#3B82F6]/40" />
            </div>
            <p className="text-base text-[#64748B]/80 leading-relaxed italic">
              &ldquo;For the first time I understood my biopsy result before my
              next appointment. The plain-language summary made it easy to
              discuss with my family.&rdquo;
            </p>
            <p className="mt-3 text-base font-semibold text-[#0F172A]">
              Sarah M. <span className="font-normal text-[#64748B]/70">— Nairobi, Kenya</span>
            </p>
          </motion.div>

          <motion.div
            variants={itemFade}
            className="mt-8 flex items-center gap-6 text-sm text-[#64748B]"
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              AI pre-screening
            </span>
            <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
            <span className="inline-flex items-center gap-1.5">
              Board-certified specialists
            </span>
            <span className="w-1 h-1 rounded-full bg-[#E2E8F0]" />
            <span className="inline-flex items-center gap-1.5">
              24–48h turnaround
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
