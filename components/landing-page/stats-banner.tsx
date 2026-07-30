import Link from "next/link";
import { STATS } from "@/components/landing-page/data";

export default function StatsBanner() {
  return (
    <section className="py-20 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="bg-landing-brand rounded-3xl p-10 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="text-center px-3 pt-6 md:pt-0 first:pt-0"
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 border border-white/40 text-white rounded-xl px-8 py-3.5 text-base font-semibold hover:bg-white/10 hover:border-white/60 active:scale-[0.98] transition-all duration-200"
            >
              Start a Case
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
