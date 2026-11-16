"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AppTableFeatures } from "@/components/tables/data-table"
import { FeedSourceTag, FeedStatusBadge } from "@/components/shared/data-apis-badges"
import { durationBetween } from "@/lib/format"
import type { DataFeedRun } from "@/types/data-apis"

export function makeDataFeedsColumns(
  onViewLog: (feed: DataFeedRun) => void,
  onRetry: (feed: DataFeedRun) => void
): ColumnDef<AppTableFeatures, DataFeedRun>[] {
  return [
    {
      accessorKey: "institutionName",
      header: "Institution",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.institutionName}</span>
          <FeedSourceTag source={row.original.source} />
        </div>
      ),
    },
    {
      id: "schedule",
      header: "Scheduled / Last run",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span className="font-mono">{row.original.scheduledAt}</span>
          <span className="font-mono">{row.original.completedAt ?? "Not completed"}</span>
        </div>
      ),
    },
    {
      accessorKey: "records",
      header: "Records",
      cell: ({ row }) => (
        <span className="font-mono text-sm tabular-nums">
          {row.original.records.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <FeedStatusBadge status={row.original.status} />,
    },
    {
      id: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {durationBetween(row.original.scheduledAt, row.original.completedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <MoreHorizontal />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewLog(row.original)}>
                <Eye />
                View log
              </DropdownMenuItem>
              {row.original.status !== "success" ? (
                <DropdownMenuItem onClick={() => onRetry(row.original)}>
                  <RotateCw />
                  Retry
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
