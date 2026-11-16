"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { flexRender, tableFeatures, useTable } from "@tanstack/react-table"
import { Inbox } from "lucide-react"
import { toast } from "sonner"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { DataFeedLogSheet } from "@/components/shared/data-feed-log-sheet"
import { makeDataFeedsColumns } from "@/components/tables/data-feeds-columns"
import type { DataFeedRun, FeedSource, FeedStatus } from "@/types/data-apis"

const tableFeatureSet = tableFeatures({})

const sourceLabels: Record<FeedSource, string> = {
  core_banking: "Core banking",
  momo: "MoMo",
  sacco_ledger: "SACCO ledger",
  group_records: "Group records",
}

export function DataFeedsExplorer({ data }: { data: DataFeedRun[] }) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<"all" | FeedStatus>("all")
  const [sourceFilter, setSourceFilter] = useState<"all" | FeedSource>("all")
  const [institutionFilter, setInstitutionFilter] = useState("all")
  const [activeFeed, setActiveFeed] = useState<DataFeedRun | null>(null)
  const [logOpen, setLogOpen] = useState(false)

  const institutions = useMemo(
    () => Array.from(new Set(data.map((f) => f.institutionName))).sort(),
    [data]
  )

  const filtered = useMemo(
    () =>
      data
        .filter((f) => statusFilter === "all" || f.status === statusFilter)
        .filter((f) => sourceFilter === "all" || f.source === sourceFilter)
        .filter((f) => institutionFilter === "all" || f.institutionName === institutionFilter),
    [data, statusFilter, sourceFilter, institutionFilter]
  )

  const handleRetry = useCallback(
    async (feed: DataFeedRun) => {
      const response = await fetch(`/api/data-feeds/${feed.id}/retry`, { method: "POST" })
      if (!response.ok) {
        toast.error("Couldn't retry this upload")
        return
      }
      toast.success(`${feed.institutionName} upload retried`)
      router.refresh()
    },
    [router]
  )

  const handleViewLog = useCallback((feed: DataFeedRun) => {
    setActiveFeed(feed)
    setLogOpen(true)
  }, [])

  const columns = useMemo(
    () => makeDataFeedsColumns(handleViewLog, handleRetry),
    [handleViewLog, handleRetry]
  )

  const table = useTable({
    features: tableFeatureSet,
    columns,
    data: filtered,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as typeof sourceFilter)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {Object.entries(sourceLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={institutionFilter} onValueChange={(v) => setInstitutionFilter(v ?? "all")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Institution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All institutions</SelectItem>
            {institutions.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No upload runs match"
          description="Try clearing the status, source or institution filters."
        />
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DataFeedLogSheet feed={activeFeed} open={logOpen} onOpenChange={setLogOpen} />
    </div>
  )
}
