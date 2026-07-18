import { STATS } from '@/components/landing-page/data'

export default function StatsBanner() {
  return (
    <section className="py-16">
      <div className="bg-clinical-navy rounded-2xl p-6 md:p-8 mx-6 md:mx-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center px-3 pt-3 md:pt-0 first:pt-0">
              <div className="font-headline-md text-2xl lg:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="font-label-md text-[11px] text-white/70 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
