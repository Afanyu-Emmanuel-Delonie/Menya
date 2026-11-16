"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertSeverityBadge, CategoryTag } from "@/components/shared/alert-badges"
import { EmptyState } from "@/components/shared/empty-state"
import { ListFilter } from "lucide-react"
import type { AlertRule } from "@/types/alert"

export function AlertRulesTable({ rules }: { rules: AlertRule[] }) {
  const router = useRouter()

  async function handleToggle(rule: AlertRule, enabled: boolean) {
    const response = await fetch(`/api/alert-rules/${rule.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
    if (!response.ok) {
      toast.error("Couldn't update this rule")
      return
    }
    toast.success(`"${rule.name}" ${enabled ? "enabled" : "disabled"}`)
    router.refresh()
  }

  if (rules.length === 0) {
    return (
      <EmptyState
        icon={ListFilter}
        title="No alert rules yet"
        description="Create a rule to start catching problems automatically."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead>Rule</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Channels</TableHead>
          <TableHead>Enabled</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{rule.name}</span>
                <CategoryTag category={rule.category} />
              </div>
            </TableCell>
            <TableCell className="max-w-xs text-sm text-muted-foreground">
              {rule.condition}
            </TableCell>
            <TableCell>
              <AlertSeverityBadge severity={rule.severity} />
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                {rule.channels.map((channel) => (
                  <Badge key={channel} variant="outline">
                    {channel}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Switch
                checked={rule.enabled}
                onCheckedChange={(checked) => handleToggle(rule, checked)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
