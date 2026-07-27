'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

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

          <div className="hidden md:block">
            <Link
              href="/patient"
              className="inline-flex items-center gap-2 border border-[#1E3A5F]/30 text-[#1E3A5F] bg-white/70 backdrop-blur-sm text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#1E3A5F] hover:text-white active:scale-95 transition-all duration-200"
            >
              Start Your Case
              <span aria-hidden="true">→</span>
            </Link>
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
                className="block text-base text-[#64748B] hover:text-[#1E3A5F] transition-colors px-3 py-2.5 rounded-lg hover:bg-surface-container-low"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3">
              <Link
                href="/patient"
                className="block text-center bg-[#1E3A5F] text-white text-base font-medium px-5 py-2.5 rounded-full hover:bg-[#1E3A5F] active:scale-95 transition-all duration-150"
                onClick={() => setMobileOpen(false)}
              >
                Start Your Case →
              </Link>
            </div>
          </div>
        </div>
      )
        : null}
    </nav>
  )
}
