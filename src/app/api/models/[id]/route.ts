import { NextResponse } from "next/server"

import { getModelById } from "@/lib/data/models"

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/models/[id]">
) {
  const { id } = await ctx.params
  const model = await getModelById(id)

  if (!model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 })
  }

  return NextResponse.json(model)
}
