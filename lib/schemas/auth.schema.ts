import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

export type SignInInput = z.infer<typeof signInSchema>;

const signUpBase = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
});

export const signUpPatientSchema = signUpBase.refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords don't match", path: ['confirmPassword'] },
);

export type SignUpPatientInput = z.infer<typeof signUpPatientSchema>;

export const signUpDoctorSchema = signUpBase
  .extend({
    specialty: z.string().min(1, 'Specialty is required'),
    experience: z.string().min(1, 'Experience is required'),
    bio: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpDoctorInput = z.infer<typeof signUpDoctorSchema>;
