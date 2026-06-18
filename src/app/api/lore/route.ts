import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { loreQuery } from "@/sanity/lib/queries";

export interface SignalLog {
  text: string;
  kind: "log" | "hidden";
}

export async function GET() {
  try {
    const lore = await client.fetch<SignalLog[]>(
      loreQuery,
      {},
      { next: { tags: ["signalLog"] } }
    );
    return NextResponse.json(lore ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
