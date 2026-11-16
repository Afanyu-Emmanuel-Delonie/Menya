import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { createInstitution, getInstitutions } from "@/lib/data/institutions"
import type { NewInstitutionInput } from "@/types/institution"

export async function GET() {
  const institutions = await getInstitutions()
  return NextResponse.json(institutions)
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<NewInstitutionInput>

  if (!body.name || !body.type || !body.district || !body.contactName || !body.contactEmail) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const institution = await createInstitution(body as NewInstitutionInput)
  appendAuditLogEntry({
    admin: "Amara Diallo",
    action: `Added institution ${institution.name}`,
    area: "Institutions",
    result: "Pending",
    resultTone: "neutral",
  })

  return NextResponse.json(institution, { status: 201 })
}
