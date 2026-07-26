import Link from "next/link";
import { STATS } from '@/components/landing-page/data'

export default function StatsBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="bg-clinical-navy rounded-2xl p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center px-3 pt-4 md:pt-0 first:pt-0">
                <div className="font-headline-md text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="font-label-md text-xs text-white/80 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/patient"
              className="inline-flex items-center border border-white text-white rounded-lg px-8 py-3 font-medium hover:bg-white/10 transition-colors"
            >
              Get your opinion
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
