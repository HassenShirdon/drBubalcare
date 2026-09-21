import Navigation from "@/components/landing-page/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-landing-surface text-landing-text antialiased selection:bg-landing-success/30 selection:text-landing-brand">
      <header>
        <Navigation />
      </header>
      <main>{children}</main>
      <footer className="bg-landing-brand w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 md:px-16 py-12">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Dr. Bubal Care logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full bg-white object-cover p-1"
              />
              <span className="text-xl font-bold text-white">Dr. Bubal Care</span>
            </div>
            <p className="text-white/70 max-w-sm text-sm leading-relaxed">
              Connecting patients with the board-certified physicians of our
              Global Doctors Network for clear, written diagnostic opinions.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-1.5">
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/"
              >
                Home
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/#services"
              >
                Services
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/#about"
              >
                About
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/news"
              >
                News
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Legal
            </h4>
            <nav className="flex flex-col space-y-1.5">
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/terms"
              >
                Terms of Use
              </Link>
              <Link
                className="text-white/70 hover:text-white transition-colors text-sm w-fit"
                href="/patient-rights"
              >
                Patient Rights
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Dr. Bubal Care. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
