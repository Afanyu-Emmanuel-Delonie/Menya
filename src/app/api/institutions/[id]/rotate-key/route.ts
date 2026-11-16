import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { getInstitutionById, rotateInstitutionApiKey } from "@/lib/data/institutions"

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/institutions/[id]/rotate-key">
) {
  const { id } = await ctx.params
  const existing = await getInstitutionById(id)
  if (!existing) {
    return NextResponse.json({ error: "Institution not found" }, { status: 404 })
  }

  const result = await rotateInstitutionApiKey(id)
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: `Rotated API key for ${existing.name}`,
    area: "Data & APIs",
    result: "Rotated",
    resultTone: "neutral",
  })

  return NextResponse.json(result)
}
