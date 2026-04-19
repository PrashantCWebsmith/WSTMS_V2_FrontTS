import * as z from 'zod';

export const projectSchema = z.object({
  projectIDP: z.number(),
  projectName: z.string().min(1, 'Project name is required'),
  ownerDetails: z.string(),
  contactPerson: z.string(),
  websiteCredential: z.string(),
  status: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
