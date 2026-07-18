'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Specializations', href: '#specializations' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 h-16 transition-all duration-200 ${
        scrolled
          ? 'bg-white border-b border-surface-gray/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-16 h-full">
        <Link
          href="/"
          className="font-headline-md text-lg font-semibold tracking-tight text-clinical-navy"
        >
          Dr Bubal Care
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors px-3 py-2 rounded-lg hover:bg-surface-container-low"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            href="/patient"
            className="bg-clinical-navy text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-primary-container transition-all"
          >
            Start a Case
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-clinical-navy" />
          ) : (
            <Menu className="w-5 h-5 text-clinical-navy" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-surface-gray/50 shadow-sm">
          <div className="px-6 py-4 space-y-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block font-label-md text-sm text-on-surface-variant hover:text-clinical-navy transition-colors px-3 py-2 rounded-lg hover:bg-surface-container-low"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3">
              <Link
                href="/patient"
                className="block text-center bg-clinical-navy text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary-container transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Start a Case
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
