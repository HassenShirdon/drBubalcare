'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, LogIn, LogOut, LayoutDashboard, Stethoscope, ChevronDown } from 'lucide-react'
import { ModeToggle } from "@/components/mode-toggle"
import { SERVICE_LIST } from "@/components/landing-page/service-pages-data"

const links = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function roleDashboard(role?: string | null): string {
  switch (role) {
    case 'DOCTOR': return '/doctor'
    case 'ADMIN': return '/admin'
    default: return '/patient'
  }
}

function roleLabel(role?: string | null): string {
  switch (role) {
    case 'DOCTOR': return 'Doctor Portal'
    case 'ADMIN': return 'Admin Portal'
    default: return 'Dashboard'
  }
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const signedIn = status === 'authenticated'

  return (
    <nav className="relative z-50 w-full border-b border-landing-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-10 h-16 lg:h-18">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-landing-brand shrink-0"
        >
          Dr Bubal Care
        </Link>

        <div className="hidden md:flex items-center gap-1 mx-6 overflow-visible">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-landing-text-faint hover:text-landing-brand transition-colors px-3 py-2 rounded-lg hover:bg-landing-surface-muted/60 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-landing-text-faint hover:text-landing-brand transition-colors px-3 py-2 rounded-lg hover:bg-landing-surface-muted/60 whitespace-nowrap"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {servicesOpen ? (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-card border border-landing-border/60 rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {SERVICE_LIST.map((service) => (
                  <Link
                    key={service.link}
                    href={service.link}
                    className="block text-sm text-landing-text-faint hover:text-landing-brand hover:bg-landing-surface-muted/60 px-4 py-2.5 transition-colors"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <ModeToggle />

          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-landing-border animate-pulse" />
          ) : signedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href={roleDashboard(session?.user?.role as string | undefined)}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-landing-border text-landing-brand bg-card/70 hover:bg-landing-brand hover:text-white transition-all duration-200"
              >
                <LayoutDashboard className="size-3.5" />
                {roleLabel(session?.user?.role as string | undefined)}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-landing-text-faint hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <LogOut className="size-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signup/doctor"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg border border-landing-border text-landing-text-faint bg-card/70 hover:border-landing-brand hover:text-landing-brand transition-all duration-200"
              >
                <Stethoscope className="size-3.5" />
                For Physicians
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg text-landing-text-faint hover:text-landing-brand transition-all duration-200"
              >
                <LogIn className="size-3.5" />
                Login
              </Link>
              <Link
                href="/auth/signup/patient"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-landing-brand text-white hover:bg-landing-brand/90 active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Start a Case
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-landing-surface-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="size-5 text-landing-brand" />
          ) : (
            <Menu className="size-5 text-landing-brand" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-landing-border/40 bg-background/95 backdrop-blur-md">
          <div className="px-6 py-4 space-y-1 max-w-7xl mx-auto">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-base text-landing-text-faint hover:text-landing-brand transition-colors px-3 py-2.5 rounded-lg hover:bg-landing-surface-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between w-full text-base text-landing-text-faint hover:text-landing-brand transition-colors px-3 py-2.5 rounded-lg hover:bg-landing-surface-muted"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileServicesOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {mobileServicesOpen ? (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-landing-border/40 pl-3">
                  {SERVICE_LIST.map((service) => (
                    <Link
                      key={service.link}
                      href={service.link}
                      className="block text-sm text-landing-text-faint hover:text-landing-brand transition-colors px-3 py-2 rounded-lg hover:bg-landing-surface-muted"
                      onClick={() => setMobileOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <hr className="my-3 border-landing-border/50" />

            {loading ? (
              <div className="h-10 rounded-lg bg-landing-border animate-pulse" />
            ) : signedIn ? (
              <div className="space-y-2">
                <Link
                  href={roleDashboard(session?.user?.role as string | undefined)}
                  className="block text-center text-sm font-semibold px-5 py-2.5 rounded-lg border border-landing-border text-landing-brand hover:bg-landing-surface-muted active:scale-[0.98] transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="size-4 inline mr-1.5 -mt-0.5" />
                  {roleLabel(session?.user?.role as string | undefined)}
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); signOut() }}
                  className="w-full text-center text-sm font-semibold px-5 py-2.5 rounded-lg text-landing-text-faint hover:bg-destructive/10 hover:text-destructive active:scale-[0.98] transition-all duration-150"
                >
                  <LogOut className="size-4 inline mr-1.5 -mt-0.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/signup/doctor"
                  className="flex items-center justify-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg border border-landing-border text-landing-text-faint hover:border-landing-brand hover:text-landing-brand active:scale-[0.98] transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  <Stethoscope className="size-4" />
                  For Physicians
                </Link>
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg text-landing-text-faint hover:text-landing-brand active:scale-[0.98] transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="size-4" />
                  Login
                </Link>
                <Link
                  href="/auth/signup/patient"
                  className="block text-center text-sm font-semibold px-5 py-3 rounded-lg bg-landing-brand text-white hover:bg-landing-brand/90 active:scale-[0.98] transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  Start a Case
                </Link>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
