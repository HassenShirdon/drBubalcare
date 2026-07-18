import { z } from 'zod';

export const createCaseSchema = z.object({
  serviceType: z.enum(['SPECIALIST_OPINION', 'RESULT_INTERPRETATION', 'FOLLOW_UP', 'TREND_ANALYSIS'], {
    required_error: 'Select a service type',
  }),
  description: z.string().min(10, 'Please describe your case (minimum 10 characters)').max(2000),
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
