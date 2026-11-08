'use client'

import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  ShieldAlert,
} from 'lucide-react'
import { resetPassword } from '@/lib/actions/password-reset'
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/schemas/auth.schema'
import {
  AuthFormCard,
  BrandPanel,
  FormAlert,
  PasswordTextField,
  SubmitButton,
} from '@/components/auth-shared'

function ResetPasswordForm() {
  const params = useParams<{ token: string }>()
  const token = params?.token

  const [invalidToken, setInvalidToken] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (!token) setInvalidToken(true)
  }, [token])

  async function handleReset(data: ResetPasswordInput) {
    const res = await resetPassword({
      token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })

    if (res && 'error' in res) {
      setError('root', { message: res.error })
      return
    }
    setSuccess(true)
  }

  return (
    <div className="grid min-h-dvh bg-landing-surface lg:grid-cols-[45%_55%] xl:grid-cols-2">
      <BrandPanel variant="signin" />

      <AuthFormCard
        badge="Account recovery"
        title="Choose a new password"
        subtitle="Pick a strong password you haven't used on this account before."
      >
        {invalidToken ? (
          <div className="space-y-5">
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
            >
              <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                This reset link is missing or malformed. Request a new one to
                continue.
              </span>
            </div>
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-medium text-landing-brand underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Request a new link
            </Link>
          </div>
        ) : success ? (
          <div className="space-y-5">
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-xl border border-landing-success/25 bg-landing-success/5 px-3.5 py-3 text-sm text-landing-success"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Your password has been reset. You can now sign in with your new
                password.
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
            onSubmit={handleSubmit(handleReset)}
            className="space-y-5"
            noValidate
          >
            {errors.root?.message && (
              <FormAlert message={errors.root.message} />
            )}

            <PasswordTextField
              id="password"
              label="New password"
              autoComplete="new-password"
              placeholder="At least 12 characters"
              error={errors.password?.message}
              {...register('password')}
            />

            <PasswordTextField
              id="confirmPassword"
              label="Confirm new password"
              autoComplete="new-password"
              placeholder="Repeat your new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <SubmitButton pending={isSubmitting}>
              <span className="inline-flex items-center gap-2">
                <KeyRound className="size-4" aria-hidden="true" />
                Reset password
              </span>
            </SubmitButton>
          </form>
        )}
      </AuthFormCard>
    </div>
  )
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  )
}
