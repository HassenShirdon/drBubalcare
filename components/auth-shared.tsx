'use client'

import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ModeToggle } from '@/components/mode-toggle'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'

export type BrandPanelVariant = 'signin' | 'patient' | 'doctor'

const PANEL_CONTENT: Record<
  BrandPanelVariant,
  {
    headline: string
    trust: { icon: LucideIcon; label: string; desc: string }[]
  }
> = {
  signin: {
    headline: 'One secure door. Three dedicated portals.',
    trust: [
      {
        icon: Globe,
        label: 'Global doctors network',
        desc: 'Opinions written by verified, board-certified physicians.',
      },
      {
        icon: Clock,
        label: '24-48 hour opinions',
        desc: 'Most cases receive a written opinion within two days.',
      },
      {
        icon: Shield,
        label: 'HIPAA & GDPR secure',
        desc: 'Encrypted at rest and in transit. Never shared.',
      },
    ],
  },
  patient: {
    headline: 'Your results, explained in plain language.',
    trust: [
      {
        icon: Stethoscope,
        label: 'Board-certified specialists',
        desc: 'Matched to the right subspecialty for your case.',
      },
      {
        icon: ClipboardCheck,
        label: 'Plain-language opinions',
        desc: 'Findings and next steps without medical jargon.',
      },
      {
        icon: Shield,
        label: 'Encrypted & confidential',
        desc: 'Files are encrypted on upload. Never shared.',
      },
    ],
  },
  doctor: {
    headline: 'Focus on medicine. We handle the coordination.',
    trust: [
      {
        icon: Sparkles,
        label: 'AI pre-screening attached',
        desc: 'Key findings surfaced before you open a case.',
      },
      {
        icon: Clock,
        label: 'You set the cadence',
        desc: 'Your subspecialties, hours and case capacity.',
      },
      {
        icon: ShieldCheck,
        label: 'Verified peers only',
        desc: 'Credentials checked before cases arrive.',
      },
    ],
  },
}

function PanelWordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-auth-panel-fg/60',
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-xl bg-auth-panel-chip">
        <Stethoscope
          className="size-4 text-auth-panel-fg"
          aria-hidden="true"
        />
      </span>
      <span className="text-lg font-semibold tracking-tight text-auth-panel-fg">
        Dr. Bubal Care
      </span>
    </Link>
  )
}

function DotGrid() {
  return (
    <div
      aria-hidden="true"
      className="bg-dot-grid absolute inset-0 opacity-[0.05]"
    />
  )
}

export function BrandPanel({ variant }: { variant: BrandPanelVariant }) {
  const content = PANEL_CONTENT[variant]
  const prefersReducedMotion = useReducedMotion()

  return (
    <aside className="relative hidden overflow-hidden bg-auth-panel lg:flex lg:w-[45%] xl:w-1/2 lg:items-center dark:border-r dark:border-landing-border">
      <DotGrid />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 size-[480px] rounded-full bg-landing-accent/15 blur-3xl"
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 flex w-full flex-col gap-14 p-12 xl:p-16"
      >
        <PanelWordmark />

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance text-auth-panel-fg xl:text-4xl">
            {content.headline}
          </h2>
          <span
            aria-hidden="true"
            className="mt-6 block h-1 w-14 rounded-full bg-brand-gradient"
          />

          <ul className="mt-10 space-y-6">
            {content.trust.map((item) => (
              <li key={item.label} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-auth-panel-accent text-auth-panel-accent-fg">
                  <item.icon
                    className="size-4.5"
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-auth-panel-fg">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-auth-panel-muted">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-md border-t border-auth-panel-border pt-7">
          <p className="flex items-start gap-2.5 text-xs leading-relaxed text-auth-panel-muted">
            <ShieldCheck
              className="mt-0.5 size-3.5 shrink-0 text-auth-panel-faint"
              aria-hidden="true"
            />
            <span>
              Every case closes with a human-signed written opinion. AI
              surfaces what matters, specialists decide.
            </span>
          </p>
        </div>
      </motion.div>
    </aside>
  )
}

export function AuthFormCard({
  badge,
  title,
  subtitle,
  children,
  footer,
  framed = false,
  titleClassName,
}: {
  badge: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  framed?: boolean
  titleClassName?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  const content = (
    <>
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-landing-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-landing-brand',
          framed && 'bg-landing-surface'
        )}
      >
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-landing-accent"
        />
        {badge}
      </span>
      <h1
        className={cn(
          'mt-4 text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl',
          titleClassName
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-[15px] leading-relaxed text-landing-text-muted text-balance">
          {subtitle}
        </p>
      )}

      <div className="mt-8">{children}</div>

      {footer && <div className="mt-8 space-y-3">{footer}</div>}
    </>
  )

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-landing-surface">
      <header className="flex items-center justify-between px-5 pt-5 sm:px-8 lg:hidden">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-landing-brand"
        >
          Dr. Bubal Care
        </Link>
        <ModeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:py-14">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 hidden justify-end lg:flex">
            <ModeToggle />
          </div>

          {framed ? (
            <div className="rounded-2xl border border-landing-border bg-landing-surface-card p-6 shadow-lift sm:p-8">
              {content}
            </div>
          ) : (
            content
          )}
        </motion.div>
      </main>

      <footer className="px-5 pb-6 sm:px-8">
        <p className="mx-auto flex max-w-md items-center justify-center gap-1.5 text-xs text-landing-text-faint">
          <Lock className="size-3" aria-hidden="true" />
          Encrypted in transit and at rest. HIPAA & GDPR aligned.
        </p>
      </footer>
    </div>
  )
}

export function FormAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

type FieldBaseProps = {
  id: string
  label: string
  icon?: LucideIcon
  error?: string
  optional?: boolean
}

function FieldLabel({
  htmlFor,
  label,
  optional,
}: {
  htmlFor: string
  label: string
  optional?: boolean
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-sm font-medium text-foreground"
    >
      {label}
      {optional && (
        <span className="font-normal text-landing-text-faint">
          {' '}
          (optional)
        </span>
      )}
    </Label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  )
}

export function TextField({
  id,
  label,
  icon: Icon,
  error,
  optional,
  className,
  ...props
}: FieldBaseProps & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} label={label} optional={optional} />
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-landing-text-faint"
          />
        )}
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'h-11 rounded-xl bg-card md:text-base',
            Icon && 'pl-9 pr-3',
            className
          )}
          {...props}
        />
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

const PASSWORD_RULES = [
  { label: 'At least 12 characters', test: (v: string) => v.length >= 12 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number', test: (v: string) => /[0-9]/.test(v) },
  {
    label: 'One special character',
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
]

export function PasswordTextField({
  id,
  label,
  error,
  action,
  checklistValue,
  showChecklist = false,
  className,
  ...props
}: Omit<FieldBaseProps, 'icon'> & {
  action?: ReactNode
  checklistValue?: string
  showChecklist?: boolean
} & Omit<React.ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false)
  const rules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    ok: rule.test(checklistValue ?? ''),
  }))
  const allOk = rules.every((r) => r.ok)

  return (
    <div className="space-y-1.5">
      {action ? (
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={id} label={label} />
          {action}
        </div>
      ) : (
        <FieldLabel htmlFor={id} label={label} />
      )}
      <div className="relative">
        <Lock
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-landing-text-faint"
        />
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? `${id}-error` : null, showChecklist ? `${id}-rules` : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={cn(
            'h-11 rounded-xl bg-card pl-9 pr-11 md:text-base',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-landing-text-faint transition-colors hover:bg-landing-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      <FieldError id={`${id}-error`} message={error} />
      {showChecklist && checklistValue && checklistValue.length > 0 && !allOk && (
        <ul
          id={`${id}-rules`}
          className="grid grid-cols-1 gap-x-4 gap-y-1.5 pt-1 sm:grid-cols-2"
        >
          {rules.map((rule) => (
            <li key={rule.label} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full',
                  rule.ok
                    ? 'bg-landing-success/15 text-landing-success'
                    : 'border border-landing-border text-landing-text-faint'
                )}
                aria-hidden="true"
              >
                {rule.ok ? (
                  <Check className="size-2.5" />
                ) : (
                  <Circle className="size-1 fill-current" />
                )}
              </span>
              <span
                className={cn(
                  'text-xs',
                  rule.ok ? 'text-landing-text-muted' : 'text-landing-text-faint'
                )}
              >
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SelectField({
  id,
  label,
  icon: Icon,
  options,
  placeholder = 'Select...',
  error,
  optional,
  className,
  ...props
}: FieldBaseProps & {
  options: string[]
  placeholder?: string
} & Omit<React.ComponentProps<'select'>, 'id'>) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} label={label} optional={optional} />
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-landing-text-faint"
          />
        )}
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-xl border border-input bg-card pl-9 pr-9 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-landing-text-faint"
        />
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export function TextAreaField({
  id,
  label,
  error,
  optional,
  className,
  ...props
}: Omit<FieldBaseProps, 'icon'> & React.ComponentProps<'textarea'>) {
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} label={label} optional={optional} />
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'min-h-[88px] w-full resize-none rounded-xl border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm',
          className
        )}
        {...props}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-landing-text-faint">
        {children}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-landing-border" />
    </div>
  )
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean
  children: ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-landing-brand px-6 text-sm font-semibold text-primary-foreground shadow-sm shadow-landing-brand/20 transition-all duration-200 hover:bg-landing-brand/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Please wait...
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="size-4" aria-hidden="true" />
        </>
      )}
    </button>
  )
}

export function AuthLinkRow({
  href,
  icon: Icon,
  label,
  sub,
}: {
  href: string
  icon: LucideIcon
  label: string
  sub?: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-landing-border bg-card px-4 py-3 transition-all duration-200 hover:border-landing-brand/40 hover:bg-landing-surface-muted active:scale-[0.99]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-landing-accent-soft text-landing-brand">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        {sub && (
          <span className="block truncate text-xs text-landing-text-faint">
            {sub}
          </span>
        )}
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-4 text-landing-text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-landing-brand"
      />
    </Link>
  )
}
