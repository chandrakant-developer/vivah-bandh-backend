import { z } from 'zod';

const calculateAge = (dob) => {
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const monthDifference = today.getMonth() - dob.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
};

export const registerSchema = z
  .object(
    {
      profileFor: z.enum(['self', 'son', 'daughter', 'brother', 'sister', 'relative', 'friend'], {
        error: 'Profile for must be self, son, daughter, brother, sister, relative, or friend',
      }),

      gender: z.enum(['male', 'female'], {
        error: 'Gender must be male or female',
      }),

      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Name can contain only letters and spaces'),

      dob: z.coerce.date({
        error: 'Invalid date of birth',
      }),

      religion: z.string().trim().min(1, 'Religion is required'),

      community: z.string().trim().min(1, 'Community is required'),

      email: z.string().trim().email('Invalid email address'),

      mobile: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters'),
    },
    {
      error: (issue) => {
        if (issue.code === 'unrecognized_keys') {
          return {
            message: `Invalid fields: ${issue.keys.join(', ')}`,
          };
        }

        return undefined;
      },
    }
  )
  .strict()
  .superRefine((data, ctx) => {
    const today = new Date();

    if (data.dob > today) {
      ctx.addIssue({
        code: 'custom',
        path: ['dob'],
        message: 'Date of birth cannot be in the future',
      });

      return;
    }

    const age = calculateAge(data.dob);

    const minAge = data.gender === 'male' ? 21 : 18;

    if (age < minAge) {
      ctx.addIssue({
        code: 'custom',
        path: ['dob'],
        message: `Minimum age for ${data.gender} is ${minAge} years`,
      });
    }

    const maxAge = data.gender === 'male' ? 45 : 40;

    if (age > maxAge) {
      ctx.addIssue({
        code: 'custom',
        path: ['dob'],
        message: `Maximum age for ${data.gender} is ${maxAge} years`,
      });
    }
  });
