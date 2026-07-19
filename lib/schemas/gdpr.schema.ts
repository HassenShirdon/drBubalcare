import { z } from 'zod';

export const consentSchema = z.object({
  consentType: z.enum(['AI_PROCESSING', 'DATA_SHARING']),
  granted: z.boolean(),
});

export type ConsentInput = z.infer<typeof consentSchema>;
