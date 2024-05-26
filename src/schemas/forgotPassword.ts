import { z } from "zod";

export const forgotPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
