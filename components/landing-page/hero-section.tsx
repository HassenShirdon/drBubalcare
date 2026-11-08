"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  LockKeyhole,
  Play,
  ShieldCheck,
  Timer,
} from "lucide-react";

const ASSURANCES = [
  { icon: ShieldCheck, label: "Board-certified reviewers" },
  { icon: LockKeyhole, label: "Encrypted uploads" },
  { icon: Timer, label: "24-48h written opinion" },
] as const;

// Set NEXT_PUBLIC_DEMO_YOUTUBE_ID to the 11-char YouTube video ID
// (the part after ?v=) to activate the embed. While empty, a lightweight
// "coming soon" placeholder renders and no YouTube resources are loaded.
const DEMO_YOUTUBE_ID = process.env.NEXT_PUBLIC_DEMO_YOUTUBE_ID || "";

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const hasVideo = DEMO_YOUTUBE_ID.length > 0;

  const enter = (delay: number) =>
    prefersReducedMotion
      ? false
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay } };

  return (
    <section
      id="home"
      className="grain relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-landing-accent/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 md:px-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <motion.p
            {...enter(0.05)}
            className="inline-flex items-center gap-2 rounded-full border border-landing-border/70 bg-landing-surface-card px-3.5 py-1.5 text-xs font-medium tracking-[0.08em] text-landing-text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-landing-accent" />
            Diagnostic coordination for East Africa
          </motion.p>

          <motion.h1
            {...enter(0.1)}
            className="mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] text-landing-text sm:text-5xl lg:text-[3.75rem]"
          >
            Your lab results are in.
            <br />
            <span className="text-landing-brand">Now what?</span>
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="mt-6 max-w-xl text-lg leading-relaxed text-landing-text-muted md:text-xl"
          >
            Skip the cross-country trip to find answers. Dr. Bubal Care connects
            you with board-certified physicians who read your file and return a
            written opinion in plain language, usually within two days.
          </motion.p>

          <motion.div
            {...enter(0.22)}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 rounded-xl bg-landing-brand px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing-surface active:scale-[0.98]"
            >
              Start a case
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-base font-semibold text-landing-brand transition-colors duration-200 hover:text-landing-brand/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/30"
            >
              See how it works
            </Link>
          </motion.div>

          <motion.ul
            {...enter(0.28)}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            {ASSURANCES.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-landing-text-muted"
              >
                <item.icon
                  className="h-4 w-4 text-landing-accent"
                  aria-hidden="true"
                />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          {...enter(0.2)}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div
            className="absolute inset-x-6 -bottom-4 top-6 -rotate-2 rounded-3xl border border-landing-border/60 bg-landing-surface-muted"
            aria-hidden="true"
          />
          <div className="shadow-lift relative overflow-hidden rounded-3xl border border-landing-border/70 bg-landing-brand">
            {hasVideo && playing ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${DEMO_YOUTUBE_ID}?autoplay=1&rel=0`}
                title="Dr. Bubal Care demo video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => hasVideo && setPlaying(true)}
                disabled={!hasVideo}
                className="group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden disabled:cursor-default"
                aria-label={
                  hasVideo ? "Play demo video" : "Demo video coming soon"
                }
              >
                <div
                  className="bg-dot-grid absolute inset-0 opacity-[0.06]"
                  aria-hidden="true"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 right-[-8%] h-72 w-72 rounded-full bg-landing-accent/20 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 left-[-8%] h-72 w-72 rounded-full bg-landing-accent-alt/30 blur-3xl"
                />

                <span
                  className={`relative flex size-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur transition-transform duration-200 ${
                    hasVideo
                      ? "group-hover:scale-105 group-focus-visible:scale-105"
                      : ""
                  }`}
                >
                  <Play
                    className="ml-0.5 size-6 fill-white text-white"
                    aria-hidden="true"
                  />
                </span>
                <p className="relative mt-5 text-sm font-semibold text-white">
                  Watch the demo
                </p>
                <p className="relative mt-1 text-xs text-white/60">
                  See the full journey, from upload to written opinion
                </p>
                {!hasVideo && (
                  <span className="relative mt-4 rounded-full border border-white/20 px-3 py-1 text-[11px] font-medium tracking-wide text-white/60">
                    Demo video coming soon
                  </span>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
