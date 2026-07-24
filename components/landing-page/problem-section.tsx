"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cards = [
  {
    title: "The Access Gap",
    description:
      "1 specialist per 100,000+ patients in many regions. Your local doctor may never see your condition before.",
  },
  {
    title: "The Travel Burden",
    description:
      "6+ hours average travel to reach a specialist. Families sacrifice work, savings, and time for a single consultation.",
  },
  {
    title: "The Wait",
    description:
      "Weeks to months for an appointment. Meanwhile, anxiety builds and treatment delays compound.",
  },
];

export default function ProblemSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
      className="relative overflow-hidden py-24 bg-gradient-to-b from-surface via-surface to-surface-gray/50"
    >
      {/* Soft three-color washes for balance */}
      <div
        aria-hidden="true"
        className="absolute -top-24 right-0 w-[380px] h-[380px] rounded-full bg-evidence-blue-light/30 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 left-0 w-[340px] h-[340px] rounded-full bg-healing-teal/8 blur-3xl -z-10"
      />

      <div className="max-w-5xl mx-auto px-6 md:px-16">
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto space-y-4 mb-16"
        >
          <h2 className="font-headline-md text-2xl md:text-3xl font-semibold text-text-clinical-navy tracking-tight leading-snug text-balance text-center">
            The specialist care gap is real
          </h2>
          <p className="font-body-lg text-base text-on-surface-variant/80 leading-relaxed text-balance text-center">
            Patients in underserved regions face impossible choices: travel for
            hours, wait for months, or go without expert answers.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeInUp}
              className="relative rounded-2xl border border-outline-variant/40 bg-surface p-7 shadow-sm hover:shadow-md transition-shadow border-l-4 border-healing-teal"
            >
              <p className="font-headline-md text-2xl font-bold text-clinical-navy mb-3 leading-tight">
                {card.title}
              </p>
              <p className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-healing-teal font-semibold text-lg mb-2">
            There&apos;s a better way.
          </p>
          <ChevronDown className="w-6 h-6 text-healing-teal mx-auto animate-bounce" />
        </div>
      </div>
    </motion.section>
  );
}
