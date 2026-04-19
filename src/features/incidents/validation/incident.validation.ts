import * as z from 'zod';

export const incidentSchema = z.object({
  projectIDF: z.number().min(1, 'Project is required'),
  taskIDF: z.number(),
  userIDF: z.number().min(1, 'User is required'),
  criticalPoint: z.string().min(1, 'Critical points are required'),
  nonCriticalPoint: z.string(),
  severity: z.string(),
  incidentDate: z.date(),
  status: z.string()
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;
