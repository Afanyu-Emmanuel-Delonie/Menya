import { NextResponse } from "next/server"

import { getApiUsage } from "@/lib/data/data-apis"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = Number(searchParams.get("range") ?? 30)
  const rangeDays = range === 7 || range === 90 ? range : 30

  const usage = await getApiUsage(rangeDays)
  return NextResponse.json(usage)
}
