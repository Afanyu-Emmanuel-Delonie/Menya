"use client"

import { useMemo, useState } from "react"
import { flexRender, tableFeatures, useTable } from "@tanstack/react-table"
import { ArrowUpDown, Building2, Search } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { institutionsColumns } from "@/components/tables/institutions-columns"
import {
  InstitutionStatusBadge,
  InstitutionTypeTag,
} from "@/components/shared/institution-badges"
import { InstitutionRowActions } from "@/components/tables/institution-row-actions"
import type { Institution, InstitutionType } from "@/types/institution"

const tableFeatureSet = tableFeatures({})
const PAGE_SIZE = 10

const typeTabs: { value: "all" | InstitutionType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bank", label: "Banks" },
  { value: "sacco", label: "SACCOs" },
  { value: "savings_group", label: "Savings groups" },
  { value: "inclusion_partner", label: "Inclusion partners" },
]

const sortableColumns: Record<string, "name" | "membersScored" | "consentRate"> = {
  name: "name",
  membersScored: "membersScored",
  consentRate: "consentRate",
}

export function InstitutionsExplorer({ data }: { data: Institution[] }) {
  const [typeTab, setTypeTab] = useState<"all" | InstitutionType>("all")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Institution["status"]>("all")
  const [sortKey, setSortKey] = useState<"name" | "membersScored" | "consentRate" | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [pageIndex, setPageIndex] = useState(0)

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: data.length }
    for (const item of data) {
      counts[item.type] = (counts[item.type] ?? 0) + 1
    }
    return counts
  }, [data])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return data
      .filter((i) => typeTab === "all" || i.type === typeTab)
      .filter((i) => statusFilter === "all" || i.status === statusFilter)
      .filter((i) => i.name.toLowerCase().includes(query))
  }, [data, typeTab, statusFilter, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === "string" ? av.localeCompare(String(bv)) : (av as number) - (bv as number)
      return sortDir === "asc" ? cmp : -cmp
    })
    return copy
  }, [filtered, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePageIndex = Math.min(pageIndex, pageCount - 1)
  const pageRows = sorted.slice(safePageIndex * PAGE_SIZE, safePageIndex * PAGE_SIZE + PAGE_SIZE)

  const table = useTable({
    features: tableFeatureSet,
    columns: institutionsColumns,
    data: pageRows,
  })

  function resetToFirstPage() {
    setPageIndex(0)
  }

  function toggleSort(key: "name" | "membersScored" | "consentRate") {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs
        value={typeTab}
        onValueChange={(value) => {
          setTypeTab(value as typeof typeTab)
          resetToFirstPage()
        }}
      >
        <TabsList>
          {typeTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-1 text-xs text-muted-foreground">
                {typeCounts[tab.value] ?? 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            className="h-10 pl-8"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetToFirstPage()
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as typeof statusFilter)
            resetToFirstPage()
          }}
        >
          <SelectTrigger className="h-10 w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No institutions match"
          description="Try a different search term, or clear the status filter."
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="flex flex-col divide-y divide-border md:hidden">
            {pageRows.map((institution) => (
              <div key={institution.id} className="flex items-start justify-between gap-3 py-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-medium text-foreground truncate">{institution.name}</span>
                  <InstitutionTypeTag type={institution.type} />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <InstitutionStatusBadge status={institution.status} />
                    <span className="text-xs text-muted-foreground">
                      {institution.membersScored.toLocaleString()} scored
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {institution.status === "pending"
                        ? "—"
                        : `${Math.round(institution.consentRate * 100)}% consent`}
                    </span>
                    <span className="text-xs text-muted-foreground">{institution.lastUpload}</span>
                  </div>
                </div>
                <InstitutionRowActions institution={institution} />
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                    {headerGroup.headers.map((header) => {
                      const sortableKey = sortableColumns[header.column.id]
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : sortableKey ? (
                            <button
                              type="button"
                              className="flex items-center gap-1 hover:text-foreground"
                              onClick={() => toggleSort(sortableKey)}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <ArrowUpDown
                                className={cn(
                                  "size-3.5",
                                  sortKey === sortableKey
                                    ? "text-foreground"
                                    : "text-muted-foreground/40"
                                )}
                              />
                            </button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </TableHead>
                      )
                    })}
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
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {safePageIndex * PAGE_SIZE + 1}–
              {Math.min(sorted.length, (safePageIndex + 1) * PAGE_SIZE)} of {sorted.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safePageIndex === 0}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={safePageIndex >= pageCount - 1}
                onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
