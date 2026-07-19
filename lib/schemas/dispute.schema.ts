import { z } from 'zod';

export const fileDisputeSchema = z.object({
  reason: z.string().min(20, 'Please provide a detailed reason (minimum 20 characters)').max(2000),
});

export type FileDisputeInput = z.infer<typeof fileDisputeSchema>;

export const triageDisputeSchema = z.object({
  valid: z.boolean(),
  adminNotes: z.string().optional(),
});

export type TriageDisputeInput = z.infer<typeof triageDisputeSchema>;

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(10, 'Resolution must be at least 10 characters').max(2000),
  adminNotes: z.string().optional(),
});

export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;

export const assignPeerReviewSchema = z.object({
  specialistId: z.string().min(1, 'Select a specialist'),
});

export type AssignPeerReviewInput = z.infer<typeof assignPeerReviewSchema>;
