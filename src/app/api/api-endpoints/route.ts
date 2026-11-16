import { NextResponse } from "next/server"

import { getApiEndpoints } from "@/lib/data/data-apis"

export async function GET() {
  const endpoints = await getApiEndpoints()
  return NextResponse.json(endpoints)
}
