"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/heroImage.svg";

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
    <section
      id="home"
      className="relative overflow-hidden pb-20 md:pb-28 pt-12 md:pt-20 bg-surface"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative z-10 order-2 lg:order-1 flex flex-col items-start text-left"
          >
            <motion.div
              variants={itemFade}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clinical-navy/5 border border-clinical-navy/10 text-sm font-medium text-clinical-navy mb-5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-healing-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-healing-teal" />
              </span>
              Now serving Kenya, Uganda, and Tanzania
            </motion.div>

            <motion.h1
              variants={itemFade}
              className="font-headline-md text-4xl sm:text-5xl lg:text-5xl text-text-medical-black font-semibold leading-[1.15] tracking-tight text-balance max-w-xl"
            >
              A specialist opinion on your diagnosis, without the wait.
            </motion.h1>

            <motion.p
              variants={itemFade}
              className="mt-5 font-body-lg text-lg text-on-surface-variant/85 max-w-md leading-relaxed"
            >
              Upload your records. A board-certified pathologist, radiologist,
              or oncologist reviews your case and returns a plain-language
              written opinion in 24–48 hours.
            </motion.p>

            <motion.div
              variants={itemFade}
              className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Link
                href="/patient"
                className="inline-flex items-center gap-2 bg-clinical-navy text-white text-base font-semibold px-7 py-3.5 rounded-lg hover:bg-primary transition-colors duration-200"
              >
                Get a specialist opinion
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-clinical-navy hover:text-primary text-base font-semibold px-2 py-3.5 transition-colors duration-200"
              >
                See how it works
              </Link>
            </motion.div>

            <motion.div
              variants={itemFade}
              className="mt-8 pt-6 border-t border-surface-gray w-full max-w-md"
            >
              <p className="text-base text-on-surface-variant/80 leading-relaxed">
                &ldquo;For the first time I understood my biopsy result before my
                next appointment. The plain-language summary made it easy to
                discuss with my family.&rdquo;
              </p>
              <p className="mt-3 text-base font-semibold text-text-medical-black">
                Sarah M. <span className="font-normal text-on-surface-variant/70">— Nairobi, Kenya</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative order-1 lg:order-2 flex items-center justify-center"
          >
            <div className="relative w-full max-w-xl lg:max-w-2xl aspect-[1159/771] rounded-2xl overflow-hidden bg-surface-gray/50 border border-surface-gray">
              <Image
                src={heroImage}
                alt="Board-certified specialist reviewing a patient case"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
