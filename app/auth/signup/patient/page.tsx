'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Stethoscope, User } from 'lucide-react'
import {
  signUpPatientSchema,
  type SignUpPatientInput,
} from '@/lib/schemas/auth.schema'
import { registerPatient } from '@/lib/actions/auth'
import {
  AuthFormCard,
  AuthLinkRow,
  BrandPanel,
  FormAlert,
  PasswordTextField,
  SubmitButton,
  TextField,
} from '@/components/auth-shared'

export default function SignUpPatientPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
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
            if (messages?.length)
              setError(key as keyof SignUpPatientInput, {
                message: messages[0],
              })
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
    <div className="grid min-h-dvh bg-landing-surface lg:grid-cols-[45%_55%] xl:grid-cols-2">
      <BrandPanel variant="patient" />

      <AuthFormCard
        badge="For patients"
        title="Create your patient account"
        subtitle="Start a case today and receive a written opinion from a board-certified physician — in plain language."
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
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <TextField
            id="email"
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

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

          <SubmitButton pending={isSubmitting}>Create Account</SubmitButton>
        </form>

        <div className="mt-8 space-y-3">
          <AuthLinkRow
            href="/auth/signin"
            icon={Stethoscope}
            label="Already have an account?"
            sub="Sign in to your portal"
          />
          <p className="text-center text-sm text-landing-text-muted">
            Are you a physician?{' '}
            <Link
              href="/auth/signup/doctor"
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
