export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]/50 fixed top-0 w-full z-50">
        <div className="flex justify-between items-center max-w-4xl mx-auto px-6 md:px-16 py-4">
          <span className="text-2xl font-bold text-[#1E3A5F]">Dr. Bubal Care</span>
        </div>
      </nav>

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-6 md:px-16">
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-[#E2E8F0] rounded mb-8" />
          <div className="aspect-[2/1] rounded-2xl bg-[#E2E8F0] mb-10" />
          <div className="max-w-3xl space-y-4">
            <div className="h-4 w-20 bg-[#E2E8F0] rounded" />
            <div className="h-10 w-full bg-[#E2E8F0] rounded-lg" />
            <div className="h-10 w-3/4 bg-[#E2E8F0] rounded-lg" />
            <div className="h-4 w-56 bg-[#E2E8F0] rounded pt-4" />
            <div className="space-y-2.5 pt-6">
              <div className="h-4 w-full bg-[#E2E8F0] rounded" />
              <div className="h-4 w-11/12 bg-[#E2E8F0] rounded" />
              <div className="h-4 w-full bg-[#E2E8F0] rounded" />
              <div className="h-4 w-4/5 bg-[#E2E8F0] rounded" />
              <div className="h-4 w-full bg-[#E2E8F0] rounded" />
              <div className="h-4 w-2/3 bg-[#E2E8F0] rounded" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
