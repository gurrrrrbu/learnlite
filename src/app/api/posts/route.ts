import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuthUser, PostSchema } from "@/lib/middleware";

/**
 * GET /api/posts
 * Fetch all posts
 */
export async function GET() {
  try {
    await connectDB();

    // Fetch posts with their owner details
    const posts = await Post.find().populate("owner", "name email");

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/posts
 * Create a new post (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(); // ✅ Awaited properly
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // ✅ Validate using Zod schema
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Create post and assign owner
    const created = await Post.create({
      ...parsed.data,
      owner: user.id,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
