import { NextResponse } from "next/server"

import { getDataFeeds } from "@/lib/data/data-apis"

export async function GET() {
  const feeds = await getDataFeeds()
  return NextResponse.json(feeds)
}
