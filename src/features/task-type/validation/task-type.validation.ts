import * as z from 'zod';

export const taskTypeSchema = z.object({
  taskType: z.string().min(1, 'Task type is required').max(50, 'Too long'),
  description: z.string().optional().nullable(),
  status: z.boolean()
});

export type TaskTypeFormValues = z.infer<typeof taskTypeSchema>;
