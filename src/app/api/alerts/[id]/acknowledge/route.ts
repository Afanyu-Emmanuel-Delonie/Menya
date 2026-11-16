import { NextResponse } from "next/server"

import { acknowledgeAlert, getAlertById } from "@/lib/data/alerts"
import { appendAuditLogEntry } from "@/lib/data/audit-log"

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/alerts/[id]/acknowledge">
) {
  const { id } = await ctx.params
  const existing = await getAlertById(id)
  if (!existing) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 })
  }

  const alert = await acknowledgeAlert(id, "Amara Diallo")
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: `Acknowledged alert "${alert.title}"`,
    area: "Alerts & Incidents",
    result: "Acknowledged",
    resultTone: "neutral",
  })

  return NextResponse.json(alert)
}
