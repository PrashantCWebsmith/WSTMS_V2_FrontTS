import * as z from 'zod';

export const prioritySchema = z.object({
  priorityName: z.string().min(1, 'Priority name is required').max(100, 'Too long'),
  description: z.string().optional().nullable(),
  status: z.boolean()
});

export type PriorityFormValues = z.infer<typeof prioritySchema>;
