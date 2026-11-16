"use client"

import Link from "next/link"
import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { CategoryTag, AlertStatusBadge, severityConfig } from "@/components/shared/alert-badges"
import { cn } from "cn"
import type { PlatformAlert } from "@/types/alert"

const leftBorder: Record<PlatformAlert["severity"], string> = {
  critical: "border-l-destructive",
  warning: "border-l-warning",
  info: "border-l-info",
}

const iconTone: Record<PlatformAlert["severity"], string> = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-info",
}

export function AlertFeedCard({
  alert,
  onChanged,
  onCreateIncident,
}: {
  alert: PlatformAlert
  onChanged: () => void
  onCreateIncident: (alert: PlatformAlert) => void
}) {
  const [isPending, startTransition] = useTransition()
  const config = severityConfig[alert.severity]
  const Icon = config.icon

  function handleAcknowledge() {
    startTransition(async () => {
      const response = await fetch(`/api/alerts/${alert.id}/acknowledge`, { method: "POST" })
      if (!response.ok) { toast.error("Couldn't acknowledge this alert"); return }
      toast.success("Alert acknowledged")
      onChanged()
    })
  }

  function handleResolve() {
    startTransition(async () => {
      const response = await fetch(`/api/alerts/${alert.id}/resolve`, { method: "POST" })
      if (!response.ok) { toast.error("Couldn't resolve this alert"); return }
      toast.success("Alert resolved")
      onChanged()
    })
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-l-2 bg-card p-3",
        leftBorder[alert.severity]
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-4 shrink-0", iconTone[alert.severity])} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground leading-snug">{alert.title}</span>
          <span className="text-xs text-muted-foreground">{alert.description}</span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-xs text-muted-foreground">{alert.triggeredAt}</span>
          <AlertStatusBadge status={alert.status} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pl-7">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryTag category={alert.category} />
          <Link href={alert.sourceLink} className="text-xs font-medium text-primary hover:underline">
            {alert.source}
          </Link>
        </div>
        {alert.status !== "resolved" ? (
          <div className="flex items-center gap-1.5">
            {alert.status === "open" ? (
              <Button size="xs" variant="outline" disabled={isPending} onClick={handleAcknowledge}>
                Acknowledge
              </Button>
            ) : null}
            <Button size="xs" variant="outline" disabled={isPending} onClick={handleResolve}>
              Resolve
            </Button>
            <Button size="xs" variant="ghost" onClick={() => onCreateIncident(alert)}>
              Create incident
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
