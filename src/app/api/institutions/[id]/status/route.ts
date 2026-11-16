import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { getInstitutionById, setInstitutionStatus } from "@/lib/data/institutions"

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/institutions/[id]/status">
) {
  const { id } = await ctx.params
  const { status } = (await request.json()) as { status?: "active" | "suspended" }

  if (status !== "active" && status !== "suspended") {
    return NextResponse.json({ error: "status must be active or suspended" }, { status: 400 })
  }

  const existing = await getInstitutionById(id)
  if (!existing) {
    return NextResponse.json({ error: "Institution not found" }, { status: 404 })
  }

  const updated = await setInstitutionStatus(id, status)
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: status === "active" ? `Approved ${updated.name}` : `Suspended ${updated.name}`,
    area: "Institutions",
    result: status === "active" ? "Active" : "Suspended",
    resultTone: status === "active" ? "positive" : "negative",
  })

  return NextResponse.json(updated)
}
