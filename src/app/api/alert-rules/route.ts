import { NextResponse } from "next/server"

import { createAlertRule, getAlertRules } from "@/lib/data/alerts"
import type { NewAlertRuleInput } from "@/types/alert"

export async function GET() {
  const rules = await getAlertRules()
  return NextResponse.json(rules)
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<NewAlertRuleInput>

  if (
    !body.category ||
    !body.metric ||
    !body.operator ||
    body.threshold === undefined ||
    !body.severity ||
    !body.channels?.length
  ) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const rule = await createAlertRule(body as NewAlertRuleInput)
  return NextResponse.json(rule, { status: 201 })
}
