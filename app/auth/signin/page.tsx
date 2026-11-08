'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Loader2, Mail, Stethoscope, UserRound } from 'lucide-react'
import { signInSchema, type SignInInput } from '@/lib/schemas/auth.schema'
import {
  AuthFormCard,
  BrandPanel,
  FormAlert,
  PasswordTextField,
  SubmitButton,
  TextField,
} from '@/components/auth-shared'

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  async function handleSignIn(data: SignInInput) {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      setError('root', { message: 'Invalid email or password' })
    } else {
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      const role = session?.user?.role

      if (role === 'ADMIN') {
        window.location.href = '/admin'
      } else if (role === 'DOCTOR') {
        window.location.href = '/doctor'
      } else {
        window.location.href = '/patient'
      }
    }
  }

  return (
    <div className="grid min-h-dvh bg-landing-surface lg:grid-cols-[45%_55%] xl:grid-cols-2">
      <BrandPanel variant="signin" />

      <AuthFormCard
        badge="Secure sign in"
        title="Welcome back"
        subtitle="One account for the whole network — patients, physicians and administrators sign in here."
        framed
        titleClassName="text-3xl sm:text-4xl"
      >
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="space-y-5"
          noValidate
        >
          {errors.root?.message && <FormAlert message={errors.root.message} />}

          <TextField
            id="email"
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            className="bg-landing-surface"
            {...register('email')}
          />

          <PasswordTextField
            id="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            className="bg-landing-surface"
            action={
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-landing-brand underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            }
            {...register('password')}
          />

          <div className="pt-1">
            <SubmitButton pending={isSubmitting}>Sign in</SubmitButton>
          </div>
        </form>

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px flex-1 bg-landing-border" />
            <span className="text-xs font-medium text-landing-text-faint">
              New to Dr. Bubal Care?
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-landing-border" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/auth/signup/patient"
              className="group flex items-center gap-3 rounded-xl border border-landing-border bg-landing-surface px-4 py-3 transition-all duration-200 hover:border-landing-brand/40 hover:bg-landing-surface-muted active:scale-[0.99]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-landing-accent-soft text-landing-brand">
                <UserRound className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  Patient account
                </span>
                <span className="block truncate text-xs text-landing-text-faint">
                  Start a case in minutes
                </span>
              </span>
            </Link>

            <Link
              href="/auth/signup/doctor"
              className="group flex items-center gap-3 rounded-xl border border-landing-border bg-landing-surface px-4 py-3 transition-all duration-200 hover:border-landing-brand/40 hover:bg-landing-surface-muted active:scale-[0.99]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-landing-accent-soft text-landing-brand">
                <Stethoscope className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  Join as physician
                </span>
                <span className="block truncate text-xs text-landing-text-faint">
                  Verified within 48 hours
                </span>
              </span>
            </Link>
          </div>
        </div>
      </AuthFormCard>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-landing-surface">
          <Loader2
            className="size-6 animate-spin text-landing-brand"
            aria-hidden="true"
          />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
