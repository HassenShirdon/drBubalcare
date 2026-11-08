import { Resend } from 'resend';
import { getBaseUrl } from '@/lib/app-url';
import PasswordResetEmail from '@/lib/email/templates/password-reset';

export const EMAIL_FROM = 'Dr. Bubal Care <info@drbubalcare.com>';

let resend: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

export interface SendPasswordResetEmailArgs {
  to: string;
  name?: string | null;
  token: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  token,
}: SendPasswordResetEmailArgs): Promise<{ delivered: boolean }> {
  const baseUrl = getBaseUrl();
  const resetUrl = `${baseUrl}/auth/reset-password/${token}`;
  const expiresInMinutes = 60;

  const client = getResend();
  if (!client) {
    console.info(`[email:dev] Password reset link for ${to}: ${resetUrl}`);
    return { delivered: false };
  }

  const { error } = await client.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Reset your Dr. Bubal Care password',
    react: PasswordResetEmail({
      name,
      resetUrl,
      expiresInMinutes,
    }),
  });

  if (error) {
    console.error(`[email] Failed to send password reset to ${to}:`, error);
    throw new Error('Failed to send password reset email');
  }

  return { delivered: true };
}
