'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { signInSchema, type SignInInput } from '@/lib/schemas/auth.schema';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

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
      callbackUrl,
    });

    if (res?.error) {
      setError('root', { message: 'Invalid email or password' });
    } else if (res?.url) {
      window.location.href = res.url;
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="font-headline-md text-2xl font-semibold text-clinical-navy">
            Dr Bubal Care
          </Link>
          <h1 className="mt-6 font-headline-md text-2xl font-bold text-text-medical-black">
            Sign in to your account
          </h1>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant">
            Access your patient or physician portal
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSignIn)} className="bg-white rounded-2xl p-8 border border-surface-gray/60 shadow-sm space-y-5">
          {errors.root?.message && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="font-label-md text-sm font-medium text-clinical-navy">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50" />
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.email?.message && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="font-label-md text-sm font-medium text-clinical-navy">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50" />
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.password?.message && (
              <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-clinical-navy text-white font-medium text-sm py-3 rounded-xl hover:bg-primary-container transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <p className="text-center font-body-md text-sm text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup/patient" className="text-clinical-navy font-medium hover:text-healing-teal transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-center font-body-md text-sm text-on-surface-variant">
          Are you a physician?{' '}
          <Link href="/auth/signup/doctor" className="text-clinical-navy font-medium hover:text-healing-teal transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
