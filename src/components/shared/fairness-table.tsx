import { CheckStateBadge } from "@/components/shared/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FairnessRow } from "@/types/models"

export function FairnessTable({ rows }: { rows: FairnessRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead>Dimension</TableHead>
          <TableHead>Group</TableHead>
          <TableHead>Approval rate</TableHead>
          <TableHead>Average score</TableHead>
          <TableHead>Check</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.dimension}-${row.group}`}>
            <TableCell className="text-muted-foreground">{row.dimension}</TableCell>
            <TableCell className="font-medium text-foreground">{row.group}</TableCell>
            <TableCell className="font-mono tabular-nums">
              {Math.round(row.approvalRate * 100)}%
            </TableCell>
            <TableCell className="font-mono tabular-nums">{row.avgScore.toFixed(2)}</TableCell>
            <TableCell>
              <CheckStateBadge state={row.state} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
