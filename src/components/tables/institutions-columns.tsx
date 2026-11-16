"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { InstitutionRowActions } from "@/components/tables/institution-row-actions"
import type { AppTableFeatures } from "@/components/tables/data-table"
import {
  InstitutionStatusBadge,
  InstitutionTypeTag,
} from "@/components/shared/institution-badges"
import type { Institution } from "@/types/institution"

export const institutionsColumns: ColumnDef<AppTableFeatures, Institution>[] = [
  {
    accessorKey: "name",
    header: "Institution",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{row.original.name}</span>
        <InstitutionTypeTag type={row.original.type} />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <InstitutionStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "membersScored",
    header: "Members scored",
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums">
        {row.original.membersScored.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "consentRate",
    header: "Consent rate",
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-nums">
        {row.original.status === "pending" ? "—" : `${Math.round(row.original.consentRate * 100)}%`}
      </span>
    ),
  },
  {
    accessorKey: "lastUpload",
    header: "Last upload",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.lastUpload}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <InstitutionRowActions institution={row.original} />
      </div>
    ),
  },
]
