import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { getIncidentById, updateIncidentStatus } from "@/lib/data/alerts"
import type { IncidentStatus } from "@/types/alert"

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/incidents/[id]/status">
) {
  const { id } = await ctx.params
  const existing = await getIncidentById(id)
  if (!existing) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 })
  }

  const body = (await request.json()) as {
    status?: IncidentStatus
    author?: string
    rootCause?: string
    resolution?: string
  }

  if (!body.status || !body.author) {
    return NextResponse.json({ error: "status and author are required" }, { status: 400 })
  }

  try {
    const incident = await updateIncidentStatus(id, body.status, body.author, {
      rootCause: body.rootCause,
      resolution: body.resolution,
    })

    appendAuditLogEntry({
      admin: body.author,
      action: `Changed incident "${incident.title}" status to ${body.status}`,
      area: "Alerts & Incidents",
      result: body.status,
      resultTone: body.status === "resolved" ? "positive" : "neutral",
    })

    return NextResponse.json(incident)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update status" },
      { status: 400 }
    )
  }
}
