import { z } from 'zod';
export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerUserSchema = z.object({
    firstname: z.string().min(2),
    lastname: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});
