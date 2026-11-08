"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Globe, LockKeyhole, ShieldCheck, Timer } from "lucide-react";

const ASSURANCES = [
  { icon: ShieldCheck, label: "Board-certified reviewers" },
  { icon: LockKeyhole, label: "Encrypted uploads" },
  { icon: Timer, label: "24-48h written opinion" },
] as const;

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

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
          <div className="shadow-lift relative rounded-3xl border border-landing-border/70 bg-landing-surface-card p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-landing-brand text-[11px] font-semibold tracking-wide text-white">
                  DB
                </span>
                <div className="leading-tight">
                  <p className="font-mono text-xs tabular-nums text-landing-text-faint">
                    CASE #DBC-4821
                  </p>
                  <p className="text-sm font-medium text-landing-text">
                    Hematopathology review
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-landing-success/12 px-2 py-1 text-[11px] font-semibold tracking-wide text-landing-success">
                <span className="h-1.5 w-1.5 rounded-full bg-landing-success" />
                Opinion ready
              </span>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold tracking-[0.1em] text-landing-text-faint">
                PLAIN-LANGUAGE SUMMARY
              </p>
              <p className="text-[15px] leading-relaxed text-landing-text-muted">
                Your blood counts show a mild iron deficiency, not the bone
                marrow condition your first report suggested. No further imaging
                is needed right now.
              </p>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-landing-border/70 pt-5">
              {[
                { label: "Hemoglobin", value: "11.2 g/dL", tone: "warn" as const },
                { label: "Ferritin", value: "9 ng/mL", tone: "warn" as const },
                { label: "Platelets", value: "248 x10⁹/L", tone: "ok" as const },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-landing-text-muted">{row.label}</span>
                  <span className="flex items-center gap-2 font-mono tabular-nums text-landing-text">
                    {row.value}
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        row.tone === "warn"
                          ? "bg-landing-accent"
                          : "bg-landing-success"
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-landing-border/70 pt-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-landing-surface-muted text-landing-brand">
                <Globe className="size-4" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-landing-text">
                  Global Doctors Network
                </p>
                <p className="text-xs text-landing-text-faint">
                  Board-certified physicians
                </p>
              </div>
              <span className="ml-auto text-[11px] font-medium text-landing-text-faint">
                Signed
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
