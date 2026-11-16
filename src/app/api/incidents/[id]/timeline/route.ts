import { NextResponse } from "next/server"

import { addIncidentTimelineEntry, getIncidentById } from "@/lib/data/alerts"

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/incidents/[id]/timeline">
) {
  const { id } = await ctx.params
  const existing = await getIncidentById(id)
  if (!existing) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 })
  }

  const body = (await request.json()) as { message?: string; author?: string }
  if (!body.message || !body.author) {
    return NextResponse.json({ error: "message and author are required" }, { status: 400 })
  }

  const incident = await addIncidentTimelineEntry(id, {
    author: body.author,
    type: "update",
    message: body.message,
  })

  return NextResponse.json(incident)
}
