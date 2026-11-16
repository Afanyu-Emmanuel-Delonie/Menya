"use client"

import {
  flexRender,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"
import { Inbox } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// This project's tables don't need sorting/filtering/pagination, so no
// optional features are registered — core row/column/header APIs are
// always available regardless of this set.
const tableFeatureSet = tableFeatures({})
export type AppTableFeatures = typeof tableFeatureSet

export function DataTable<TData extends RowData>({
  columns,
  data,
  onRowClick,
  emptyTitle = "Nothing here yet",
  emptyDescription = "There's no data to show for this view.",
}: {
  columns: ColumnDef<AppTableFeatures, TData>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  emptyTitle?: string
  emptyDescription?: string
}) {
  const table = useTable({
    features: tableFeatureSet,
    columns,
    data,
  })

  if (data.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
  }

  return (
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
          <TableRow
            key={row.id}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            className={onRowClick ? "cursor-pointer" : undefined}
          >
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
