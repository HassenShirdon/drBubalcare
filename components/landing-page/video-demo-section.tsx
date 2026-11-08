'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { AnimateOnScroll } from './animate-on-scroll'

// Set NEXT_PUBLIC_DEMO_YOUTUBE_ID to the 11-char YouTube video ID
// (the part after ?v=) to activate the embed. While empty, a lightweight
// "coming soon" placeholder renders and no YouTube resources are loaded.
const DEMO_YOUTUBE_ID = process.env.NEXT_PUBLIC_DEMO_YOUTUBE_ID || ''

export default function VideoDemoSection() {
  const [playing, setPlaying] = useState(false)
  const hasVideo = DEMO_YOUTUBE_ID.length > 0

  return (
    <section id="demo" className="py-20 md:py-28 bg-landing-surface">
      <div className="mx-auto max-w-5xl px-6 md:px-16">
        <AnimateOnScroll className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-landing-text tracking-tight leading-[1.2] text-balance">
            See how Dr. Bubal Care works
          </h2>
          <p className="mt-4 text-landing-text-muted leading-relaxed text-base">
            From upload to written opinion — watch a short walkthrough of the
            whole journey.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1} className="relative mx-auto overflow-hidden rounded-3xl border border-landing-border/70 bg-landing-brand shadow-lift">
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
                hasVideo ? 'Play demo video' : 'Demo video coming soon'
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
                  hasVideo ? 'group-hover:scale-105 group-focus-visible:scale-105' : ''
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
        </AnimateOnScroll>
      </div>
    </section>
  )
}
