import { type NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/serverClient";

const ID_RE = /^[a-zA-Z0-9._-]+$/;

const approvedCommentsQuery = groq`
  *[_type == "comment" && approved == true && post._ref == $postId]
    | order(createdAt asc){ _id, name, message, createdAt }
`;

// List approved comments for a post
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId || !ID_RE.test(postId)) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }
  try {
    const comments = await client.fetch(
      approvedCommentsQuery,
      { postId },
      { cache: "no-store" }
    );
    return NextResponse.json({ comments });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Submit a comment — stored unapproved (pending moderation)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const postId = typeof body.postId === "string" ? body.postId : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot = typeof body.hp === "string" ? body.hp : "";

    // Bot honeypot — pretend success, store nothing
    if (honeypot) return NextResponse.json({ ok: true });

    if (!ID_RE.test(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }
    if (name.length < 1 || name.length > 50) {
      return NextResponse.json({ error: "Name must be 1–50 characters" }, { status: 400 });
    }
    if (message.length < 1 || message.length > 2000) {
      return NextResponse.json({ error: "Message must be 1–2000 characters" }, { status: 400 });
    }

    // Make sure the referenced post actually exists
    const exists = await client.fetch<boolean>(
      groq`defined(*[_type == "newsPost" && _id == $postId][0]._id)`,
      { postId },
      { cache: "no-store" }
    );
    if (!exists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await writeClient.create({
      _type: "comment",
      name,
      message,
      post: { _type: "reference", _ref: postId },
      approved: true, // no moderation — visible immediately (untick in Studio to hide)
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
