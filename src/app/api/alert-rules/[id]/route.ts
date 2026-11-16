import { NextResponse } from "next/server"

import { toggleAlertRule } from "@/lib/data/alerts"

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/alert-rules/[id]">
) {
  const { id } = await ctx.params
  const { enabled } = (await request.json()) as { enabled?: boolean }

  if (typeof enabled !== "boolean") {
    return NextResponse.json({ error: "enabled must be a boolean" }, { status: 400 })
  }

  try {
    const rule = await toggleAlertRule(id, enabled)
    return NextResponse.json(rule)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update rule" },
      { status: 404 }
    )
  }
}
