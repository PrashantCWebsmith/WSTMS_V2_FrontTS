import * as z from 'zod';

export const taskSchema = z.object({
  taskIDP: z.number(),
  taskTitle: z.string().min(1, 'Task title is required'),
  taskDescription: z.string().min(1, 'Description is required'),
  projectIDF: z.number().min(1, 'Project is required'),
  taskStatusIDF: z.number().min(1, 'Status is required'),
  taskTypeIDF: z.number().min(1, 'Task type is required'),
  priorityIDF: z.number().min(1, 'Priority is required'),
  assignToIDF: z.number().min(1, 'Assignee is required'),
  deadlineDate: z.string().min(1, 'Deadline date is required'),
  startDate: z.string().optional().nullable(),
  estimatedHours: z.number().default(0),
  actualHours: z.number().default(0),
  progressPercent: z.number().min(0).max(100).default(0),
  isBlocked: z.boolean().default(false),
  blockReason: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
