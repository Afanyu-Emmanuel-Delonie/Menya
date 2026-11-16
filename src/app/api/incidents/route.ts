import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { createIncident, getIncidents } from "@/lib/data/alerts"
import type { NewIncidentInput } from "@/types/alert"

export async function GET() {
  const incidents = await getIncidents()
  return NextResponse.json(incidents)
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<NewIncidentInput>

  if (!body.title || !body.severity || !body.owner || !body.affected || !body.description) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const incident = await createIncident(body as NewIncidentInput)
  appendAuditLogEntry({
    admin: body.owner,
    action: `Declared incident "${incident.title}"`,
    area: "Alerts & Incidents",
    result: incident.severity,
    resultTone: incident.severity === "SEV1" ? "negative" : "neutral",
  })

  return NextResponse.json(incident, { status: 201 })
}
