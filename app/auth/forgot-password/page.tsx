'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { requestPasswordReset } from '@/lib/actions/password-reset'
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/schemas/auth.schema'
import {
  AuthFormCard,
  BrandPanel,
  FormAlert,
  SubmitButton,
  TextField,
} from '@/components/auth-shared'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const sentEmail = searchParams.get('sent')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function handleRequest(data: ForgotPasswordInput) {
    const formData = new FormData()
    formData.append('email', data.email)

    const res = await requestPasswordReset(formData)

    if (res && 'error' in res) {
      const message =
        typeof res.error === 'string'
          ? res.error
          : res.error.email?.[0] || 'Something went wrong'
      setError('root', { message })
      return
    }
    window.location.href = `/auth/forgot-password?sent=${encodeURIComponent(data.email)}`
  }

  return (
    <div className="grid min-h-dvh bg-landing-surface lg:grid-cols-[45%_55%] xl:grid-cols-2">
      <BrandPanel variant="signin" />

      <AuthFormCard
        badge="Account recovery"
        title="Forgot your password?"
        subtitle="Enter the email linked to your account and we'll send you a secure reset link. It expires in 60 minutes."
      >
        {sentEmail ? (
          <div className="space-y-5">
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-xl border border-landing-success/25 bg-landing-success/5 px-3.5 py-3 text-sm text-landing-success"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                If an account exists for that email, a reset link is on its
                way. Check your inbox, and the spam folder just in case.
              </span>
            </div>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-landing-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleRequest)}
            className="space-y-5"
            noValidate
          >
            {errors.root?.message && (
              <FormAlert message={errors.root.message} />
            )}

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

            <SubmitButton pending={isSubmitting}>
              Send reset link
            </SubmitButton>

            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-sm font-medium text-landing-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </form>
        )}
      </AuthFormCard>
    </div>
  )
}

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </Suspense>
  )
}
