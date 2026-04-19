import * as z from 'zod';

export const taskStatusSchema = z.object({
  taskStatus: z.string().min(1, 'Status name is required').max(50, 'Too long'),
  description: z.string().max(250, 'Too long'),
  sortOrder: z.number().min(0, 'Must be positive'),
  status: z.boolean(),
  isDisplayInKanban: z.boolean()
});

export type TaskStatusFormValues = z.infer<typeof taskStatusSchema>;
