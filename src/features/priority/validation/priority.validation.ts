import * as z from 'zod';

export const prioritySchema = z.object({
  priorityName: z.string().min(1, 'Priority name is required').max(50, 'Too long'),
  priorityColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  description: z.string().optional().nullable(),
  status: z.boolean()
});

export type PriorityFormValues = z.infer<typeof prioritySchema>;
