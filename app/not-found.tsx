import Link from "next/link";
import { ArrowLeft, ArrowRight, FileQuestion } from "lucide-react";

const HELPFUL_LINKS = [
  { label: "Start a case", href: "/patient" },
  { label: "Medical second opinion", href: "/services/medical-second-opinion" },
  { label: "Find a specialist", href: "/directory" },
  { label: "Latest news", href: "/news" },
];

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="grain relative flex min-h-[100dvh] items-center overflow-hidden bg-landing-surface px-6 py-20 md:px-16"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-landing-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-landing-border/70 bg-landing-surface-card px-3.5 py-1.5 text-xs font-medium tracking-[0.08em] text-landing-text-muted">
          <FileQuestion className="h-3.5 w-3.5 text-landing-accent" aria-hidden="true" />
          Error 404
        </span>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-landing-text md:text-5xl">
          We could not find that page.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-landing-text-muted">
          The link may be broken or the page may have moved. Your case files and
          reports are safe — pick up where you left off below.
        </p>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-landing-brand px-7 py-3.5 text-base font-semibold text-white shadow-soft transition-all duration-200 hover:bg-landing-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-landing-surface active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-3 text-base font-semibold text-landing-brand transition-colors duration-200 hover:text-landing-brand/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-brand/30"
          >
            Contact support
          </Link>
        </div>

        <div className="mt-12 border-t border-landing-border/70 pt-8">
          <p className="text-sm font-medium text-landing-text-faint">
            Popular destinations
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {HELPFUL_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-2 text-base font-medium text-landing-text transition-colors hover:text-landing-brand"
                >
                  {item.label}
                  <ArrowRight
                    className="h-4 w-4 text-landing-text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-landing-brand"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
