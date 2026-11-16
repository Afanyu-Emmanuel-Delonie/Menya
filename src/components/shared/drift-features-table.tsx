import { StatusBadge } from "@/components/shared/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DriftFeature } from "@/types/models"

export function DriftFeaturesTable({ features }: { features: DriftFeature[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead>Input feature</TableHead>
          <TableHead>What changed</TableHead>
          <TableHead>Drift</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => (
          <TableRow key={feature.feature}>
            <TableCell className="font-medium text-foreground">{feature.feature}</TableCell>
            <TableCell className="text-muted-foreground">{feature.change}</TableCell>
            <TableCell>
              <StatusBadge
                label={feature.state === "drifting" ? "Drifting" : "Stable"}
                tone={feature.state === "drifting" ? "warning" : "positive"}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
