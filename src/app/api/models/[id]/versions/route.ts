import { NextResponse } from "next/server"

import { appendAuditLogEntry } from "@/lib/data/audit-log"
import { getModelById, setLiveVersion, type VersionAction } from "@/lib/data/models"

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/models/[id]/versions">
) {
  const { id } = await ctx.params
  const body = (await request.json()) as { version?: string; action?: VersionAction }
  const { version, action } = body

  if (!version || (action !== "promote" && action !== "rollback")) {
    return NextResponse.json({ error: "version and action are required" }, { status: 400 })
  }

  const model = await getModelById(id)
  if (!model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 })
  }

  try {
    const updated = await setLiveVersion(id, version, action)
    appendAuditLogEntry({
      admin: "Amara Diallo",
      action:
        action === "promote"
          ? `Promoted ${updated.name} ${version} to live`
          : `Rolled back ${updated.name} to ${version}`,
      area: "Models",
      result: action === "promote" ? "Success" : "Rolled back",
      resultTone: action === "promote" ? "positive" : "neutral",
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update version" },
      { status: 400 }
    )
  }
}
