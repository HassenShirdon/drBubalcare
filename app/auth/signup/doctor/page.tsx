'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Mail,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react'
import {
  signUpDoctorSchema,
  type SignUpDoctorInput,
} from '@/lib/schemas/auth.schema'
import { registerDoctor } from '@/lib/actions/auth'
import {
  AuthFormCard,
  AuthLinkRow,
  BrandPanel,
  FormAlert,
  PasswordTextField,
  SectionLabel,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/auth-shared'

export default function SignUpDoctorPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
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
          if (messages?.length)
            setError(key as keyof SignUpDoctorInput, { message: messages[0] })
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
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Obstetrics & Gynecology',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Urology',
    'General Practice',
    'Other',
  ]

  const experienceLevels = [
    '1-3 Yrs',
    '4-6 Yrs',
    '7-10 Yrs',
    '11-15 Yrs',
    '15+ Yrs',
  ]

  return (
    <div className="grid min-h-dvh bg-landing-surface lg:grid-cols-[45%_55%] xl:grid-cols-2">
      <BrandPanel variant="doctor" />

      <AuthFormCard
        badge="For physicians"
        title="Join the Doctors Network"
        subtitle="Offer written opinions on your schedule. We route matched cases and handle everything else."
      >
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="space-y-5"
          noValidate
        >
          {errors.root?.message && <FormAlert message={errors.root.message} />}

          <TextField
            id="name"
            label="Full Name"
            type="text"
            icon={User}
            autoComplete="name"
            placeholder="Dr. Jane Smith"
            error={errors.name?.message}
            {...register('name')}
          />

          <TextField
            id="email"
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="dr.smith@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              id="specialty"
              label="Specialty"
              icon={Stethoscope}
              options={specialties}
              error={errors.specialty?.message}
              {...register('specialty')}
            />

            <SelectField
              id="experience"
              label="Experience"
              icon={BookOpen}
              options={experienceLevels}
              error={errors.experience?.message}
              {...register('experience')}
            />
          </div>

          <SectionLabel>Optional profile details</SectionLabel>

          <TextAreaField
            id="bio"
            label="Bio"
            optional
            rows={3}
            {...register('bio')}
            placeholder="Tell patients about your background and approach..."
            error={errors.bio?.message}
          />

          <TextField
            id="imageUrl"
            label="Profile Image URL"
            type="url"
            optional
            {...register('imageUrl')}
            placeholder="https://example.com/photo.jpg"
            error={errors.imageUrl?.message}
          />

          <SectionLabel>Account security</SectionLabel>

          <PasswordTextField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a password"
            showChecklist
            checklistValue={watch('password') ?? ''}
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordTextField
            id="confirmPassword"
            label="Confirm Password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="flex items-start gap-2.5 rounded-xl border border-landing-border bg-landing-accent-soft px-3.5 py-3 text-sm text-landing-text-muted">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-landing-brand"
              aria-hidden="true"
            />
            <span>
              Credentials and medical registration are verified before your
              first case arrives — usually within 24-48 hours.
            </span>
          </div>

          <SubmitButton pending={isSubmitting}>
            Create Physician Account
          </SubmitButton>
        </form>

        <div className="mt-8 space-y-3">
          <AuthLinkRow
            href="/auth/signin"
            icon={User}
            label="Already have an account?"
            sub="Sign in to your portal"
          />
          <p className="text-center text-sm text-landing-text-muted">
            Are you a patient?{' '}
            <Link
              href="/auth/signup/patient"
              className="font-medium text-landing-brand underline-offset-4 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </AuthFormCard>
    </div>
  )
}
