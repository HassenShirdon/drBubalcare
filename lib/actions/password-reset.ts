'use server';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/client-ip';
import { logAuditEvent, AUDIT_ACTIONS } from '@/lib/audit/logger';
import { sendPasswordResetEmail } from '@/lib/email/send';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/schemas/auth.schema';

const RESET_TOKEN_BYTES = 32;
const RESET_EXPIRY_MINUTES = 60;

function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export type RequestPasswordResetResult =
  | { success: true }
  | { error: { email: string[] } }
  | { error: string };

export async function requestPasswordReset(
  formData: FormData,
): Promise<RequestPasswordResetResult> {
  const raw = Object.fromEntries(formData);
  const parsed = forgotPasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: { email: ['Please enter a valid email address'] } };
  }

  const { email } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const headerStore = await headers();
  const ip = getClientIp(headerStore);

  const ipCheck = await checkRateLimit(`forgot-ip:${ip}`, 5, 60_000);
  if (!ipCheck.allowed) {
    return { error: { email: ['Too many requests. Please try again later.'] } };
  }

  const emailCheck = await checkRateLimit(`forgot-email:${normalizedEmail}`, 3, 3_600_000);
  if (!emailCheck.allowed) {
    return { error: { email: ['Too many reset requests for this email. Please try again later.'] } };
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, name: true, passwordHash: true },
  });

  if (user && user.passwordHash) {
    const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('base64url');
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60_000);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      prisma.passwordResetToken.create({
        data: { tokenHash, userId: user.id, expiresAt },
      }),
    ]);

    try {
      await sendPasswordResetEmail({ to: normalizedEmail, name: user.name, token });
    } catch {
      return { error: { email: ['Could not send the reset email. Please try again later.'] } };
    }
  }

  return { success: true };
}

export interface ResetPasswordActionInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export type ResetPasswordResult = { success: true } | { error: string };

export async function resetPassword(
  input: ResetPasswordActionInput,
): Promise<ResetPasswordResult> {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);

  const ipCheck = await checkRateLimit(`reset-ip:${ip}`, 5, 60_000);
  if (!ipCheck.allowed) {
    return { error: 'Too many requests. Please try again later.' };
  }

  if (!input?.token) {
    return { error: 'Invalid or expired reset link.' };
  }

  const parsed = resetPasswordSchema.safeParse({
    password: input.password,
    confirmPassword: input.confirmPassword,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { error: first || 'Invalid password' };
  }

  const tokenHash = hashResetToken(input.token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { error: 'This reset link is invalid or has expired. Please request a new one.' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await logAuditEvent({
    userId: record.userId,
    action: AUDIT_ACTIONS.PASSWORD_RESET,
    resourceType: 'User',
    resourceId: record.userId,
    metadata: { method: 'password_reset_token' },
  });

  return { success: true };
}
