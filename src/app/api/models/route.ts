import { NextResponse } from "next/server"

import { getModels } from "@/lib/data/models"

export async function GET() {
  const models = await getModels()
  return NextResponse.json(models)
}
