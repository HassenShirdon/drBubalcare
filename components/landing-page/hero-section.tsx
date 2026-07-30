"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-20 md:pt-24 pb-16 md:pb-20"
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full bg-[#DBEAFE]/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 w-[500px] h-[500px] rounded-full bg-[#DCFCE7]/15 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-landing-text font-semibold leading-[1.1] tracking-tight text-balance max-w-3xl"
          >
            Your lab results are in.
            <br />
            <span className="text-landing-brand">Now what?</span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            className="mt-6 text-lg md:text-xl text-landing-text-muted max-w-2xl leading-relaxed text-balance"
          >
            You should not have to travel across the country to understand what
            your results mean. Dr. Bubal Care connects you with board-certified
            specialists who review your case and deliver clear, plain-language
            answers in 24-48 hours.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 bg-landing-brand text-white text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-landing-brand/90 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-landing-brand/20"
            >
              Start a Case
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-landing-brand hover:text-landing-brand/80 text-base font-semibold px-4 py-3.5 transition-colors duration-200"
            >
              How it works
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
