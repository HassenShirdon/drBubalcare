'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { Card } from '@/components/ui/card'
import { Star, Clock, Shield } from 'lucide-react'

const trustItems = [
  {
    icon: Star,
    label: 'Board-Certified Specialists',
    desc: 'Every opinion is written by a verified, board-certified physician in the relevant subspecialty.',
  },
  {
    icon: Clock,
    label: '24-48 Hour Response',
    desc: 'Most cases receive a written opinion within 24-48 hours of submission.',
  },
  {
    icon: Shield,
    label: 'HIPAA & GDPR Secure',
    desc: 'Your medical data is encrypted at rest and in transit. We never share your information.',
  },
]

export function BrandPanel() {
  return (
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-sm">
        <Link href="/">
          <span className="text-2xl font-semibold tracking-tight text-white">
            Dr Bubal Care
          </span>
        </Link>
        <p className="mt-2 text-sm text-blue-200/60 font-medium tracking-wider uppercase">
          AI surfaces - Specialists decide
        </p>
        <div className="mt-10 space-y-6">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-white/10 shrink-0">
                <item.icon className="size-4 text-blue-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-blue-200/60 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-blue-300/40 leading-relaxed">
          Every case closes with a human-signed written opinion. AI surfaces what matters; specialists make the call.
        </p>
      </div>
    </aside>
  )
}

export function AuthFormCard({
  children,
  title,
  subtitle,
}: {
  children: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Dr Bubal Care
          </Link>
          <ModeToggle />
        </div>

        <Card className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {children}
        </Card>

        <div className="hidden lg:flex justify-end mt-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
