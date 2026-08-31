import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required')
    .refine(
      (value) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        const mobileRegex = /^(?:\+91|91)?[\s-]*[6-9]\d{4}[\s-]?\d{5}$/;

        return emailRegex.test(value) || mobileRegex.test(value);
      },
      {
        message: 'Enter a valid email or mobile number',
      }
    ),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters'),
});
