"use client"

import { useState } from "react"
import { CircleCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertSeverityBadge, AlertStatusBadge, CategoryTag } from "@/components/shared/alert-badges"
import { EmptyState } from "@/components/shared/empty-state"
import type { PlatformAlert } from "@/types/alert"

export function AlertsTable({
  alerts,
  onChanged,
}: {
  alerts: PlatformAlert[]
  onChanged: () => void
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === alerts.length ? new Set() : new Set(alerts.map((a) => a.id))))
  }

  async function bulkAction(action: "acknowledge" | "resolve") {
    const ids = Array.from(selected)
    await Promise.all(ids.map((id) => fetch(`/api/alerts/${id}/${action}`, { method: "POST" })))
    toast.success(
      `${ids.length} alert${ids.length === 1 ? "" : "s"} ${
        action === "acknowledge" ? "acknowledged" : "resolved"
      }`
    )
    setSelected(new Set())
    onChanged()
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={CircleCheck}
        title="All clear — no open alerts"
        description="Nothing matches these filters right now."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {selected.size > 0 ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
          <span>{selected.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => bulkAction("acknowledge")}>
              Acknowledge
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkAction("resolve")}>
              Resolve
            </Button>
          </div>
        </div>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-8">
              <Checkbox checked={selected.size === alerts.length} onCheckedChange={toggleAll} />
            </TableHead>
            <TableHead>Alert</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Triggered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>
                <Checkbox checked={selected.has(alert.id)} onCheckedChange={() => toggle(alert.id)} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{alert.title}</span>
                  <CategoryTag category={alert.category} />
                </div>
              </TableCell>
              <TableCell>
                <AlertSeverityBadge severity={alert.severity} />
              </TableCell>
              <TableCell>
                <AlertStatusBadge status={alert.status} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{alert.triggeredAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
