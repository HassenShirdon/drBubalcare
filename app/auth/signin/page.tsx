'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { signInSchema, type SignInInput } from '@/lib/schemas/auth.schema';

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  async function handleSignIn(data: SignInInput) {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError('root', { message: 'Invalid email or password' });
    } else {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === 'ADMIN') {
        window.location.href = '/admin';
      } else if (role === 'DOCTOR') {
        window.location.href = '/doctor';
      } else {
        window.location.href = '/patient';
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#F8FAFC]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-semibold text-[#1E3A5F]">
            Dr Bubal Care
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#0F172A]">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Access your patient or physician portal
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSignIn)} className="rounded-2xl p-8 border shadow-sm space-y-5 bg-white border-[#E2E8F0]">
          {errors.root?.message && (
            <div role="alert" className="flex items-center gap-2 text-sm p-3 rounded-xl border bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]">
              <AlertCircle className="size-4 flex-shrink-0" aria-hidden="true" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#1E3A5F]">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#94A3B8]" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
              />
            </div>
            {errors.email?.message && (
              <p className="text-[#B91C1C] text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#1E3A5F]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#94A3B8]" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                style={{ background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}
              />
            </div>
            {errors.password?.message && (
              <p className="text-[#B91C1C] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-medium text-sm py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#1E3A5F]"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin text-[#22C55E]" />
            ) : (
              <>
                Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748B]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup/patient" className="font-medium text-[#3B82F6] transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-center text-sm text-[#64748B]">
          Are you a physician?{' '}
          <Link href="/auth/signup/doctor" className="font-medium text-[#3B82F6] transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-[#22C55E]" size={32} />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
