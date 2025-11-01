import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuthUser, PostSchema } from "@/lib/middleware";

/**
 * GET /api/posts/[id]
 * Fetch a single post by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();

    const { id } = context.params;
    const post = await Post.findById(id).populate("owner", "name email");
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/posts/[id]
 * Update a post (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = context.params;
    const body = await request.json();

    const parsed = PostSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    await connectDB();
    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (String(post.owner) !== String(user.id))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    post.title = parsed.data.title;
    post.content = parsed.data.content;
    await post.save();

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = context.params;
    await connectDB();

    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (String(post.owner) !== String(user.id))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await post.deleteOne();
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
