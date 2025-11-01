import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "../lib/auth";

const PROTECTED_PREFIXES = ["/api/posts"]; // endpoints that need auth (POST/PUT/DELETE)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) &&
    (req.method === "POST" || req.method === "PUT" || req.method === "DELETE");

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token || !verifyJWT(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

// Match only API routes
export const config = {
  matcher: ["/api/:path*"],
};
