'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { signInSchema, type SignInInput } from '@/lib/schemas/auth.schema'
import { BrandPanel, AuthFormCard } from '@/components/auth-shared'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-background">
      <BrandPanel />

      <AuthFormCard title="Welcome back" subtitle="Sign in to your account">
        <form
          onSubmit={handleSubmit(handleSignIn)}
          className="space-y-5"
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
              <p className="text-destructive text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="pl-9 h-9"
                {...register('password')}
              />
            </div>
            {errors.password?.message && (
              <p className="text-destructive text-xs mt-1">
                {errors.password.message}
              </p>
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
                Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup/patient"
              className="font-medium text-primary hover:underline"
            >
              Sign up
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-background">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
