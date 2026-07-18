'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { signUpPatientSchema, type SignUpPatientInput } from '@/lib/schemas/auth.schema';
import { registerPatient } from '@/lib/actions/auth';

export default function SignUpPatientPage() {
  const router = useRouter();

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
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="font-headline-md text-2xl font-semibold text-clinical-navy">
            Dr Bubal Care
          </Link>
          <h1 className="mt-6 font-headline-md text-2xl font-bold text-text-medical-black">
            Create a Patient Account
          </h1>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant">
            Register to book appointments and manage your health
          </p>
        </div>

        <form onSubmit={handleSubmit(handleSignUp)} className="bg-white rounded-2xl p-8 border border-surface-gray/60 shadow-sm space-y-5">
          {errors.root?.message && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">
              <AlertCircle className="size-4 flex-shrink-0" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="font-label-md text-sm font-medium text-clinical-navy">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50" />
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.name?.message && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="font-label-md text-sm font-medium text-clinical-navy">Email</label>
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
            {errors.email?.message && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="font-label-md text-sm font-medium text-clinical-navy">Password</label>
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
            {errors.password?.message && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="font-label-md text-sm font-medium text-clinical-navy">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50" />
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.confirmPassword?.message && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
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
                Create Account
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center space-y-2">
          <p className="font-body-md text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-clinical-navy font-medium hover:text-healing-teal transition-colors">
              Sign in
            </Link>
          </p>
          <p className="font-body-md text-sm text-on-surface-variant">
            Are you a physician?{' '}
            <Link href="/auth/signup/doctor" className="text-clinical-navy font-medium hover:text-healing-teal transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
