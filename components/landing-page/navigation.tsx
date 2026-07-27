'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
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
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const signedIn = status === 'authenticated'

  return (
    <nav className="relative z-50 w-full">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-10 h-20">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-[#1E3A5F]"
        >
          Dr Bubal Care
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base text-[#64748B] hover:text-[#1E3A5F] transition-colors px-4 py-2 rounded-full hover:bg-white/60"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 border border-[#1E3A5F]/30 text-[#1E3A5F] bg-white/70 backdrop-blur-sm text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#1E3A5F] hover:text-white active:scale-95 transition-all duration-200"
            >
              Start Your Case
              <span aria-hidden="true">→</span>
            </Link>

            {loading ? (
              <div className="w-20 h-9 rounded-full bg-[#E2E8F0] animate-pulse" />
            ) : signedIn ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href={roleDashboard(session?.user?.role as string | undefined)}
                  className="inline-flex items-center gap-1.5 text-sm border border-[#E2E8F0] text-[#1E3A5F] bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#1E3A5F] hover:text-white transition-all duration-200"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {roleLabel(session?.user?.role as string | undefined)}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 text-sm border border-[#E2E8F0] text-[#64748B] bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#B91C1C] hover:text-white transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-1.5 text-sm border border-[#1E3A5F]/30 text-[#1E3A5F] bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#1E3A5F] hover:text-white transition-all duration-200"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-full bg-white/60 hover:bg-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
          {mobileOpen ? (
            <X className="w-5 h-5 text-[#1E3A5F]" />
          ) : (
            <Menu className="w-5 h-5 text-[#1E3A5F]" />
          )}
        </button>
      </div>

      {mobileOpen
        ? (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]/50 shadow-lg">
          <div className="px-6 py-4 space-y-1 max-w-7xl mx-auto">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-base text-[#64748B] hover:text-[#1E3A5F] transition-colors px-3 py-2.5 rounded-lg hover:bg-[#F1F5F9]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 space-y-2">
              <Link
                href="/patient"
                className="block text-center bg-[#1E3A5F] text-white text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#1E3A5F] active:scale-95 transition-all duration-150"
                onClick={() => setMobileOpen(false)}
              >
                Start Your Case →
              </Link>

              {loading ? (
                <div className="h-10 rounded-full bg-[#E2E8F0] animate-pulse" />
              ) : signedIn ? (
                <>
                  <Link
                    href={roleDashboard(session?.user?.role as string | undefined)}
                    className="block text-center border border-[#E2E8F0] text-[#1E3A5F] text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#F1F5F9] active:scale-95 transition-all duration-150"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    {roleLabel(session?.user?.role as string | undefined)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); signOut() }}
                    className="w-full text-center border border-[#E2E8F0] text-[#64748B] text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#FEF2F2] hover:text-[#B91C1C] active:scale-95 transition-all duration-150"
                  >
                    <LogOut className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="block text-center border border-[#1E3A5F]/30 text-[#1E3A5F] text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#F1F5F9] active:scale-95 transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )
        : null}
    </nav>
  )
}
