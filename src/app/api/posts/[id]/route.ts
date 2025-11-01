import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuthUser, PostSchema } from "@/lib/middleware";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const post = await Post.findById(params.id).populate("owner", "name email");
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(post.owner) !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    post.title = parsed.data.title;
    post.body = parsed.data.body;
    await post.save();

    return NextResponse.json(post, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(post.owner) !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await post.deleteOne();
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
