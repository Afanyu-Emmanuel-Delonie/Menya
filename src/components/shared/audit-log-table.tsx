import Link from "next/link"
import { cn } from "cn"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type AuditLogEntry = {
  id: string
  time: string
  admin: string
  action: string
  area: string
  result: string
  resultTone: "positive" | "negative" | "neutral"
}

const resultToneClass: Record<AuditLogEntry["resultTone"], string> = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
}

export function AuditLogTable({
  title = "All Interrogations",
  entries,
  viewAllHref = "#",
}: {
  title?: string
  entries: AuditLogEntry[]
  viewAllHref?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-primary hover:underline"
        >
          View audit logs
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Time</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Results</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="tabular-nums text-muted-foreground">
                {entry.time}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {entry.admin}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.action}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.area}
              </TableCell>
              <TableCell
                className={cn("font-medium", resultToneClass[entry.resultTone])}
              >
                {entry.result}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
