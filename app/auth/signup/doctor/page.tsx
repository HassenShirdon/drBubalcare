'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Stethoscope, BookOpen, Eye, EyeOff } from 'lucide-react'
import { signUpDoctorSchema, type SignUpDoctorInput } from '@/lib/schemas/auth.schema'
import { registerDoctor } from '@/lib/actions/auth'
import { AuthFormCard } from '@/components/auth-shared'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUpDoctorPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpDoctorInput>({
    resolver: zodResolver(signUpDoctorSchema),
  })

  async function handleSignUp(data: SignUpDoctorInput) {
    const formData = new FormData()
    formData.set('name', data.name)
    formData.set('email', data.email)
    formData.set('password', data.password)
    formData.set('confirmPassword', data.confirmPassword)
    formData.set('specialty', data.specialty)
    formData.set('experience', data.experience)
    if (data.bio) formData.set('bio', data.bio)
    if (data.imageUrl) formData.set('imageUrl', data.imageUrl)

    const res = await registerDoctor(formData)

    if (res?.error) {
      if (typeof res.error === 'object') {
        for (const [key, messages] of Object.entries(res.error)) {
          if (messages?.length) setError(key as keyof SignUpDoctorInput, { message: messages[0] })
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
      router.push('/doctor')
    }
  }

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Obstetrics & Gynecology', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology',
    'Radiology', 'Urology', 'General Practice', 'Other',
  ]

  const experienceLevels = ['1-3 Yrs', '4-6 Yrs', '7-10 Yrs', '11-15 Yrs', '15+ Yrs']

  return (
    <div className="min-h-[100dvh] flex bg-background">
      <AuthFormCard title="Join as a Physician" subtitle="Register to offer second opinions and manage patient care">
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
                placeholder="Dr. Jane Smith"
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
                placeholder="dr.smith@example.com"
                className="pl-9 h-9"
                {...register('email')}
              />
            </div>
            {errors.email?.message && (
              <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
                <select
                  id="specialty"
                  {...register('specialty')}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none dark:bg-input/30"
                >
                  <option value="">Select...</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {errors.specialty?.message && (
                <p className="text-destructive text-xs mt-1">{errors.specialty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
                <select
                  id="experience"
                  {...register('experience')}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none dark:bg-input/30"
                >
                  <option value="">Select...</option>
                  {experienceLevels.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              {errors.experience?.message && (
                <p className="text-destructive text-xs mt-1">{errors.experience.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              Bio <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <textarea
              id="bio"
              rows={3}
              {...register('bio')}
              placeholder="Tell patients about your background and approach..."
              className="flex min-h-[72px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none dark:bg-input/30"
            />
            {errors.bio?.message && (
              <p className="text-destructive text-xs mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">
              Profile Image URL <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id="imageUrl"
              type="url"
              {...register('imageUrl')}
              placeholder="https://example.com/photo.jpg"
              className="h-9"
            />
            {errors.imageUrl?.message && (
              <p className="text-destructive text-xs mt-1">{errors.imageUrl.message}</p>
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
                Create Physician Account
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
            Are you a patient?{' '}
            <Link
              href="/auth/signup/patient"
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
