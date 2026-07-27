'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { signUpPatientSchema, type SignUpPatientInput } from '@/lib/schemas/auth.schema';
import { registerPatient } from '@/lib/actions/auth';

export default function SignUpPatientPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpPatientInput>({
    resolver: zodResolver(signUpPatientSchema),
  });

  async function handleSignUp(data: SignUpPatientInput) {
    const formData = new FormData();
    formData.set('name', data.name);
    formData.set('email', data.email);
    formData.set('password', data.password);
    formData.set('confirmPassword', data.confirmPassword);

    try {
      const res = await registerPatient(formData);

      if (res?.error) {
        if (typeof res.error === 'object') {
          for (const [key, messages] of Object.entries(res.error)) {
            if (messages?.length) setError(key as keyof SignUpPatientInput, { message: messages[0] });
          }
        }
        return;
      }

      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push('/patient');
      }
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-semibold text-[#1E3A5F]">
            Dr Bubal Care
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#0F172A]">
            Create a Patient Account
          </h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Register to book appointments and manage your health
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSignUp)} className="bg-white rounded-2xl p-8 border border-[#E2E8F0]/60 shadow-sm space-y-5">
          {errors.root?.message && (
            <div role="alert" className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">
              <AlertCircle className="size-4 flex-shrink-0" aria-hidden="true" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-[#1E3A5F]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#64748B]/50" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all"
              />
            </div>
            {errors.name?.message && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-[#1E3A5F]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#64748B]/50" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all"
              />
            </div>
            {errors.email?.message && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#1E3A5F]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#64748B]/50" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]/50 hover:text-[#1E3A5F] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>
            {errors.password?.message && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#1E3A5F]">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#64748B]/50" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#64748B]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]/50 hover:text-[#1E3A5F] transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>
            {errors.confirmPassword?.message && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1E3A5F] text-white font-medium text-sm py-3 rounded-xl hover:bg-[#1E3A5F]/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <div className="text-center space-y-2">
          <p className="text-sm text-[#64748B]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#1E3A5F] font-medium hover:text-[#15803D] transition-colors">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-[#64748B]">
            Are you a physician?{' '}
            <Link href="/auth/signup/doctor" className="text-[#1E3A5F] font-medium hover:text-[#15803D] transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
