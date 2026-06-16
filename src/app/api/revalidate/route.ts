import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Invalidate cached CMS-driven data; pages re-render on next request.
  revalidateTag("newsPost");
  revalidateTag("transmission");
  return NextResponse.json({ revalidated: true, tags: ["newsPost", "transmission"], now: Date.now() });
}
