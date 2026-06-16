import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Invalidate the cached news data; the homepage re-renders on next request.
  revalidateTag("newsPost");
  return NextResponse.json({ revalidated: true, tag: "newsPost", now: Date.now() });
}
