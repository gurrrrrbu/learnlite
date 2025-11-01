import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// ✅ Define type for authenticated user
export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
};

// ✅ Schemas for validation
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const PostSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  content: z.string().min(10, "Content is too short"),
});

/**
 * ✅ getAuthUser()
 * Reads JWT token from cookies and verifies it.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    // ⬇️ `cookies()` is async in Next.js 16+
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    return decoded;
  } catch (error) {
    console.error("❌ Error verifying user token:", error);
    return null;
  }
}
