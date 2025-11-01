import { z } from "zod";
import { cookies } from "next/headers";
import { verifyJWT } from "./auth";

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const PostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = verifyJWT<{ id: string; email: string }>(token);
  return payload;
}
