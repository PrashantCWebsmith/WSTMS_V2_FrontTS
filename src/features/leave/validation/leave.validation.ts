import * as z from 'zod';

export const leaveSchema = z.object({
  leaveName: z.string().min(1, 'Leave name is required').max(100, 'Too long'),
  leaveCode: z.string().min(1, 'Code is required').max(10, 'Too long'),
  isPaid: z.boolean(),
  maxDaysPerYear: z.number().min(0, 'Must be positive').max(365, 'Invalid days'),
  description: z.string().max(500, 'Too long'),
  status: z.boolean()
});

export type LeaveFormValues = z.infer<typeof leaveSchema>;
