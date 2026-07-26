"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Play, Clock, Award, Sparkles } from "lucide-react";
import heroImage from "@/assets/heroImage.svg";

const avatars = [
  { initials: "SM", color: "bg-clinical-navy" },
  { initials: "JK", color: "bg-healing-teal" },
  { initials: "AH", color: "bg-primary" },
  { initials: "EO", color: "bg-secondary" },
];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const stagger = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
      };

  const itemFade = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" as const },
        },
      };

  return (
    <section
      id="home"
      className="relative overflow-hidden pb-16 md:pb-24 pt-12 md:pt-16 bg-gradient-to-b from-surface via-surface to-surface-gray/50"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full px-0 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10 order-2 lg:order-1 flex flex-col items-start lg:items-start text-left"
          >
            <motion.h1
              variants={itemFade}
              className="font-headline-md text-2xl sm:text-3xl lg:text-[2.75rem] text-text-medical-black font-semibold leading-[1.2] tracking-tight text-balance max-w-xl"
            >
              Specialist clarity{" "}
              <span className="text-clinical-navy">for your health</span>, in
              24–48 hours.
            </motion.h1>

            <motion.p
              variants={itemFade}
              className="mt-5 font-body-lg text-sm md:text-base text-on-surface-variant/85 max-w-md leading-relaxed"
            >
              Upload your lab results, scans, or biopsy. A board-certified
              specialist reviews your case and returns a plain-language written
              opinion you can trust.
            </motion.p>

            <motion.div
              variants={itemFade}
              className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Link
                href="/patient"
                className="inline-flex items-center gap-2 bg-clinical-navy text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-primary transition-all duration-200 shadow-lg shadow-clinical-navy/20 hover:shadow-xl hover:shadow-clinical-navy/25"
              >
                Start Your Case
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-healing-teal/50 text-healing-teal hover:bg-healing-teal/5 text-sm font-semibold px-6 py-3.5 rounded-full transition-all duration-200"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-healing-teal/10">
                  <Play
                    className="w-3 h-3 fill-healing-teal"
                    aria-hidden="true"
                  />
                </span>
                See How It Works
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemFade}
              className="mt-8 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.initials}
                    className={`w-10 h-10 rounded-full ${avatar.color} border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                    aria-hidden="true"
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-medical-black">
                  500+ Patients Helped
                </p>
                <p className="text-xs text-on-surface-variant/70">
                  Across East Africa
                </p>
              </div>
            </motion.div>

            {/* Floating cards */}
            <motion.div
              variants={itemFade}
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg"
            >
              <div className="group relative bg-white/80 backdrop-blur-sm border border-surface-gray rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-medical-black">
                      24-48h Turnaround
                    </p>
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      Board-certified answers, fast.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy shrink-0 group-hover:bg-clinical-navy group-hover:text-white transition-colors duration-200">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-sm border border-surface-gray rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-medical-black">
                      AI-Assisted Review
                    </p>
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      AI surfaces, specialists decide.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-healing-teal/10 flex items-center justify-center text-healing-teal shrink-0 group-hover:bg-healing-teal group-hover:text-white transition-colors duration-200">
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative order-1 lg:order-2 flex items-center justify-center"
          >
            {/* Decorative starburst */}
            <div
              className="absolute top-8 left-4 lg:left-0 text-clinical-navy/20"
              aria-hidden="true"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 0L26.5 21.5L48 24L26.5 26.5L24 48L21.5 26.5L0 24L21.5 21.5L24 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Curved decorative line */}
            <svg
              className="absolute -left-8 lg:-left-16 top-1/2 w-32 lg:w-48 h-auto text-clinical-navy/15 -translate-y-1/2 hidden sm:block"
              viewBox="0 0 200 120"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 110C60 110 70 20 120 20C170 20 160 90 190 60"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
            </svg>

            {/* Main image container */}
            <div className="relative w-full max-w-xl lg:max-w-2xl aspect-[1159/771] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-evidence-blue-light via-white to-surface-gray shadow-2xl shadow-clinical-navy/10 border border-white/50">
              <Image
                src={heroImage}
                alt="Friendly board-certified specialist ready to review your case"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
              />

              {/* Soft bottom gradient for image blend */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge on image */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-2 -left-4 lg:-left-8 bg-white rounded-2xl px-4 py-3 shadow-lg border border-surface-gray flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-healing-teal/10 flex items-center justify-center text-healing-teal">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant/70">Verified</p>
                <p className="text-sm font-semibold text-text-medical-black">
                  Board-Certified
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
