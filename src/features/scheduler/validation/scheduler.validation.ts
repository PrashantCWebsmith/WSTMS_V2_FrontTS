import { z } from 'zod';

export const schedulerSchema = z.object({
    emailSubject: z.string().min(1, 'Email subject is required'),
    emailBody: z.string().min(1, 'Email body is required'),
    sendToEmailIDs: z.string().min(1, 'Recipient email IDs are required'),
    ccEmailIDs: z.string().optional().nullable(),
    startDate: z.date(),
    repeatType: z.string().min(1, 'Repeat type is required'),
    repeatDays: z.string().optional().nullable(),
    status: z.boolean()
});

export type SchedulerFormValues = z.infer<typeof schedulerSchema>;
