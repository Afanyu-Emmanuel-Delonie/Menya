import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { createApiKey, getApiKeys } from "@/lib/data/data-apis"
import type { NewApiKeyInput } from "@/types/data-apis"

export async function GET() {
  const keys = await getApiKeys()
  return NextResponse.json(keys)
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<NewApiKeyInput>

  if (!body.institutionId || !body.label || !body.environment) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  try {
    const result = await createApiKey(body as NewApiKeyInput)
    appendAuditLogEntry({
      admin: "Amara Diallo",
      action: `Created ${result.key.environment} API key "${result.key.label}" for ${result.key.institutionName}`,
      area: "Data & APIs",
      result: "Active",
      resultTone: "positive",
    })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create key" },
      { status: 400 }
    )
  }
}
