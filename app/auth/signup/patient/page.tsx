'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { signUpPatientSchema, type SignUpPatientInput } from '@/lib/schemas/auth.schema'
import { registerPatient } from '@/lib/actions/auth'
import { AuthFormCard } from '@/components/auth-shared'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUpPatientPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpPatientInput>({
    resolver: zodResolver(signUpPatientSchema),
  })

  async function handleSignUp(data: SignUpPatientInput) {
    const formData = new FormData()
    formData.set('name', data.name)
    formData.set('email', data.email)
    formData.set('password', data.password)
    formData.set('confirmPassword', data.confirmPassword)

    try {
      const res = await registerPatient(formData)

      if (res?.error) {
        if (typeof res.error === 'object') {
          for (const [key, messages] of Object.entries(res.error)) {
            if (messages?.length) setError(key as keyof SignUpPatientInput, { message: messages[0] })
          }
        }
        return
      }

      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInRes?.ok) {
        router.push('/patient')
      }
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="min-h-[100dvh] flex bg-background">
      <AuthFormCard title="Create your account" subtitle="Join as a patient and start your care journey">
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="space-y-4"
          noValidate
        >
          {errors.root?.message && (
            <div
              role="alert"
              className="flex items-center gap-2 text-sm p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className="pl-9 h-9"
                {...register('name')}
              />
            </div>
            {errors.name?.message && (
              <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="pl-9 h-9"
                {...register('email')}
              />
            </div>
            {errors.email?.message && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a password"
                className="pl-9 pr-9 h-9"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="pl-9 pr-9 h-9"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-9 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/80 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p>
            Are you a physician?{' '}
            <Link
              href="/auth/signup/doctor"
              className="font-medium text-primary hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </AuthFormCard>
    </div>
  )
}
