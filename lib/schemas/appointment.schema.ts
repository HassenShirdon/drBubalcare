import { z } from 'zod';

export const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Select a service'),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
