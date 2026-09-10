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
  AuthLinkRow,
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
            {...register('email')}
          />

          <PasswordTextField
            id="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            action={
              <Link
                href="#"
                className="text-xs font-medium text-landing-brand underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            }
            {...register('password')}
          />

          <SubmitButton pending={isSubmitting}>Sign In</SubmitButton>
        </form>

        <div className="mt-8 space-y-3">
          <AuthLinkRow
            href="/auth/signup/patient"
            icon={UserRound}
            label="Create a patient account"
            sub="Start your first case in minutes"
          />
          <AuthLinkRow
            href="/auth/signup/doctor"
            icon={Stethoscope}
            label="Join as a physician"
            sub="Credential verification within 24-48 hours"
          />
        </div>

        <p className="mt-6 text-center text-sm text-landing-text-muted">
          Already registered? Your portal opens automatically based on your
          role.
        </p>
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
