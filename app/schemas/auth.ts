import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email("Invalid email address").trim(),

  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(30, "Password must not exceed 30 characters")
    .trim(),

  name: z
    .string({ error: "Name is required" })
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must not exceed 30 characters")
    .trim(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim(),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(30, "Password must not exceed 30 characters")
    .trim(),
});
