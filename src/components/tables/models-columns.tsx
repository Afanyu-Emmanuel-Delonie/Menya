"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { DriftBadge, ModelStatusBadge } from "@/components/shared/status-badge"
import type { AppTableFeatures } from "@/components/tables/data-table"
import type { ModelSummary } from "@/types/models"

export const modelsColumns: ColumnDef<AppTableFeatures, ModelSummary>[] = [
  {
    accessorKey: "name",
    header: "Model",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.purpose}</span>
      </div>
    ),
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums">{row.original.version}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ModelStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "accuracy",
    header: "Accuracy",
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums">
        {row.original.accuracy != null ? row.original.accuracy.toFixed(2) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "drift",
    header: "Drift",
    cell: ({ row }) => <DriftBadge drift={row.original.drift} />,
  },
  {
    accessorKey: "lastTrained",
    header: "Last trained",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.lastTrained}</span>
    ),
  },
]
