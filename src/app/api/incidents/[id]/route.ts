import { NextResponse } from "next/server"

import { getIncidentById } from "@/lib/data/alerts"

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/incidents/[id]">
) {
  const { id } = await ctx.params
  const incident = await getIncidentById(id)

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 })
  }

  return NextResponse.json(incident)
}
