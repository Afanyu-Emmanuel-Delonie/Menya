import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { getDataFeedById, retryDataFeed } from "@/lib/data/data-apis"

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/data-feeds/[id]/retry">
) {
  const { id } = await ctx.params
  const existing = await getDataFeedById(id)
  if (!existing) {
    return NextResponse.json({ error: "Feed run not found" }, { status: 404 })
  }

  const feed = await retryDataFeed(id)
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: `Retried ${feed.source.replace("_", " ")} upload for ${feed.institutionName}`,
    area: "Data & APIs",
    result: "Success",
    resultTone: "positive",
  })

  return NextResponse.json(feed)
}
