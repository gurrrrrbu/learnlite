import { z } from "zod";

// 🔹 Schema for user registration
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 🔹 Schema for user login
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// 🔹 Schema for creating posts
export const PostSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  content: z.string().min(10, "Content is too short"),
});

// 🔹 Authentication helper (can be expanded later)
export async function getAuthUser() {
  // This can later be implemented with JWT token parsing
  return null;
}
