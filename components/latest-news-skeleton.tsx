export default function LatestNewsSkeleton() {
  return (
    <section className="py-24 bg-card border-t border-landing-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 space-y-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 bg-landing-surface-muted rounded-full" />
          <div className="h-10 w-64 bg-landing-surface-muted rounded-lg" />
          <div className="h-5 w-96 bg-landing-surface-muted rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse bg-card rounded-2xl border border-landing-border/60 overflow-hidden"
            >
              <div className="aspect-[16/9] bg-landing-surface-muted" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-16 bg-landing-surface-muted rounded" />
                <div className="h-5 w-full bg-landing-surface-muted rounded-lg" />
                <div className="h-4 w-3/4 bg-landing-surface-muted rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
