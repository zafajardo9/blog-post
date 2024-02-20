import * as z from 'zod';

export const userLoginFormSchema = z.object({
  username: z.string({ required_error: 'This field is required.' }),
  password: z.string({ required_error: 'This field is required.' }),
  role: z.string({ required_error: 'This field is required.' }),
});

export const userRegistrationFormSchema = z.object({
    username: z.string({ required_error: 'This field is required.' }),
    password: z.string({ required_error: 'This field is required.' }),
  });
  
