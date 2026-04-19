import * as z from 'zod';

export const userSchema = z.object({
  userIDP: z.number(),
  userName: z.string().min(1, 'User Name is required'),
  userFullName: z.string().min(1, 'Full Name is required'),
  emailID: z.string().email('Invalid email address'),
  mobileNo: z.string().min(10, 'Mobile must be 10 digits').max(10, 'Mobile must be 10 digits'),
  address: z.string(),
  employeeCode: z.string().min(1, 'Employee code is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  roleIDF: z.number().min(1, 'Role is required'),
  reportingManagerIDF: z.number(),
  status: z.boolean(),
  password: z.string().optional(),
}).refine((data) => {
  if (!data.userIDP && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Password is required for new users",
  path: ["password"],
});

export type UserFormValues = z.infer<typeof userSchema>;
