import { NextResponse } from "next/server"

import { getInstitutionById } from "@/lib/data/institutions"

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/institutions/[id]">
) {
  const { id } = await ctx.params
  const institution = await getInstitutionById(id)

  if (!institution) {
    return NextResponse.json({ error: "Institution not found" }, { status: 404 })
  }

  return NextResponse.json(institution)
}
