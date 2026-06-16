import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { transmissionsQuery } from "@/sanity/lib/queries";

export interface Transmission {
  _id: string;
  title: string;
  channel: string;
  youtubeUrl: string;
  start: number;
  duration?: number;
  corrupted?: boolean;
  note?: string;
}

export async function GET() {
  try {
    const transmissions = await client.fetch<Transmission[]>(
      transmissionsQuery,
      {},
      { next: { tags: ["transmission"] } }
    );
    return NextResponse.json(transmissions ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
