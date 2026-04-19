import * as z from 'zod';

export const roleSchema = z.object({
  roleIDP: z.number(),
  roleName: z.string().min(1, 'Role name is required').max(100, 'Too long'),
  status: z.boolean(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
