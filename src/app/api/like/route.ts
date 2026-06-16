import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/serverClient";

/** Increment the like counter for a news post.
 *  Abuse is mitigated client-side (one like per browser via localStorage);
 *  this endpoint just performs the increment. */
export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json().catch(() => ({ postId: null }));

    if (typeof postId !== "string" || !/^[a-zA-Z0-9._-]+$/.test(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    const updated = await writeClient
      .patch(postId)
      .setIfMissing({ likes: 0 })
      .inc({ likes: 1 })
      .commit({ autoGenerateArrayKeys: true });

    // Refresh the cached homepage so other visitors see the new count
    revalidateTag("newsPost");

    return NextResponse.json({ likes: (updated as { likes?: number }).likes ?? null });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
