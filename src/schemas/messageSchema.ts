import {z} from 'zod';

export const messageShema = z.object({
    content:z
    .string()
    .min(10, {message:"Content must be at least 10 characters."})
    .max(300, {message:"Content must be longer than 300 characters"})
})