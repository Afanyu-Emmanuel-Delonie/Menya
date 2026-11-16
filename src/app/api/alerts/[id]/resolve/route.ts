import { NextResponse } from "next/server"

import { getAlertById, resolveAlert } from "@/lib/data/alerts"
import { appendAuditLogEntry } from "@/lib/data/audit-log"

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/alerts/[id]/resolve">
) {
  const { id } = await ctx.params
  const existing = await getAlertById(id)
  if (!existing) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 })
  }

  const alert = await resolveAlert(id)
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: `Resolved alert "${alert.title}"`,
    area: "Alerts & Incidents",
    result: "Resolved",
    resultTone: "positive",
  })

  return NextResponse.json(alert)
}
