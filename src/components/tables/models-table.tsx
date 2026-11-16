"use client"

import { useRouter } from "next/navigation"

import { DataTable } from "@/components/tables/data-table"
import { modelsColumns } from "@/components/tables/models-columns"
import type { ModelSummary } from "@/types/models"

export function ModelsTable({ data }: { data: ModelSummary[] }) {
  const router = useRouter()

  return (
    <DataTable
      columns={modelsColumns}
      data={data}
      onRowClick={(model) => router.push(`/admin/models/${model.id}`)}
      emptyTitle="No models yet"
      emptyDescription="Models will show up here once they're registered with the platform."
    />
  )
}
