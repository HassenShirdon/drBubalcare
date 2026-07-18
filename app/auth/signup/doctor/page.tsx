'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Stethoscope, BookOpen } from 'lucide-react';
import { signUpDoctorSchema, type SignUpDoctorInput } from '@/lib/schemas/auth.schema';
import { registerDoctor } from '@/lib/actions/auth';

export default function SignUpDoctorPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpDoctorInput>({
    resolver: zodResolver(signUpDoctorSchema),
  });

  async function handleSignUp(data: SignUpDoctorInput) {
    const formData = new FormData();
    formData.set('name', data.name);
    formData.set('email', data.email);
    formData.set('password', data.password);
    formData.set('confirmPassword', data.confirmPassword);
    formData.set('specialty', data.specialty);
    formData.set('experience', data.experience);
    if (data.bio) formData.set('bio', data.bio);
    if (data.imageUrl) formData.set('imageUrl', data.imageUrl);

    const res = await registerDoctor(formData);

    if (res?.error) {
      if (typeof res.error === 'object') {
        for (const [key, messages] of Object.entries(res.error)) {
          if (messages?.length) setError(key as keyof SignUpDoctorInput, { message: messages[0] });
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
      router.push('/doctor');
    }
  }

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Obstetrics & Gynecology', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology',
    'Radiology', 'Urology', 'General Practice', 'Other',
  ];

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="font-headline-md text-2xl font-semibold text-clinical-navy">
            Dr Bubal Care
          </Link>
          <h1 className="mt-6 font-headline-md text-2xl font-bold text-text-medical-black">
            Join as a Physician
          </h1>
          <p className="mt-2 font-body-md text-sm text-on-surface-variant">
            Register to offer second opinions and manage patient care
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
                placeholder="Dr. Jane Smith"
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
                placeholder="dr.smith@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
              />
            </div>
            {errors.email?.message && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="specialty" className="font-label-md text-sm font-medium text-clinical-navy">Specialty</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50 pointer-events-none" />
                <select
                  id="specialty"
                  {...register('specialty')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all appearance-none"
                >
                  <option value="">Select...</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {errors.specialty?.message && <p className="text-red-600 text-xs mt-1">{errors.specialty.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="experience" className="font-label-md text-sm font-medium text-clinical-navy">Experience</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-on-surface-variant/50 pointer-events-none" />
                <select
                  id="experience"
                  {...register('experience')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all appearance-none"
                >
                  <option value="">Select...</option>
                  {['1-3 Yrs', '4-6 Yrs', '7-10 Yrs', '11-15 Yrs', '15+ Yrs'].map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              {errors.experience?.message && <p className="text-red-600 text-xs mt-1">{errors.experience.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bio" className="font-label-md text-sm font-medium text-clinical-navy">Bio <span className="text-on-surface-variant/60 font-normal">(optional)</span></label>
            <textarea
              id="bio"
              rows={3}
              {...register('bio')}
              placeholder="Tell patients about your background and approach..."
              className="w-full px-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all resize-none"
            />
            {errors.bio?.message && <p className="text-red-600 text-xs mt-1">{errors.bio.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="imageUrl" className="font-label-md text-sm font-medium text-clinical-navy">Profile Image URL <span className="text-on-surface-variant/60 font-normal">(optional)</span></label>
            <input
              id="imageUrl"
              type="url"
              {...register('imageUrl')}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-surface-gray bg-surface text-text-medical-black font-body-md text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy transition-all"
            />
            {errors.imageUrl?.message && <p className="text-red-600 text-xs mt-1">{errors.imageUrl.message}</p>}
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
                Create Physician Account
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
            Are you a patient?{' '}
            <Link href="/auth/signup/patient" className="text-clinical-navy font-medium hover:text-healing-teal transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
