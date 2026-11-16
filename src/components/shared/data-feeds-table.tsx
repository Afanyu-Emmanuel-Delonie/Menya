import { StatusBadge } from "@/components/shared/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UploadRecord } from "@/types/institution"

const statusConfig = {
  success: { label: "Success", tone: "positive" as const },
  failed: { label: "Failed", tone: "negative" as const },
  processing: { label: "Processing", tone: "info" as const },
}

export function DataFeedsTable({ uploads }: { uploads: UploadRecord[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead>Date</TableHead>
          <TableHead>Records</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {uploads.map((upload) => {
          const config = statusConfig[upload.status]
          return (
            <TableRow key={upload.date}>
              <TableCell className="text-muted-foreground">{upload.date}</TableCell>
              <TableCell className="font-mono tabular-nums">
                {upload.records.toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusBadge label={config.label} tone={config.tone} />
              </TableCell>
              <TableCell className="font-mono tabular-nums">{upload.duration}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
