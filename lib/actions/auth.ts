'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import {
  signUpPatientSchema,
  signUpDoctorSchema,
} from '@/lib/schemas/auth.schema';

export async function registerPatient(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = signUpPatientSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: { email: ['Email already registered'] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, passwordHash, role: 'PATIENT' },
  });

  return { success: true };
}

export async function registerDoctor(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = signUpDoctorSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, specialty, experience, bio, imageUrl } =
    parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: { email: ['Email already registered'] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'DOCTOR' },
  });

  await prisma.doctor.create({
    data: {
      userId: user.id,
      specialty,
      experience,
      bio: bio ?? null,
      imageUrl: imageUrl || null,
    },
  });

  return { success: true };
}
