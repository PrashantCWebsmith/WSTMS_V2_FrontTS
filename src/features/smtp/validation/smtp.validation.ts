import * as z from 'zod';

export const smtpSchema = z.object({
  smtp: z.string().min(1, 'Server name is required').max(100, 'Too long'),
  portNo: z.number().min(1, 'Invalid port').max(65535, 'Invalid port'),
  userName: z.string().min(1, 'Username is required').max(100, 'Too long'),
  password: z.string().min(1, 'Password is required').max(100, 'Too long'),
  enableSSL: z.boolean(),
  status: z.boolean()
});

export type SMTPFormValues = z.infer<typeof smtpSchema>;
