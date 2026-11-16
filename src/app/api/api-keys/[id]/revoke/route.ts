import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { getApiKeys, revokeApiKey } from "@/lib/data/data-apis"

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/api-keys/[id]/revoke">
) {
  const { id } = await ctx.params
  const keys = await getApiKeys()
  const existing = keys.find((k) => k.id === id)
  if (!existing) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 })
  }

  const key = await revokeApiKey(id)
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: `Revoked API key "${key.label}" for ${key.institutionName}`,
    area: "Data & APIs",
    result: "Revoked",
    resultTone: "negative",
  })

  return NextResponse.json(key)
}
