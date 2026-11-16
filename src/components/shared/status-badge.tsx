import type { ReactNode } from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import type { CheckState, DriftState, ModelStatus } from "@/types/models"

export type StatusTone = "positive" | "info" | "neutral" | "warning" | "negative"

const toneClass: Record<StatusTone, string> = {
  positive: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
  warning: "bg-warning/10 text-warning",
  negative: "bg-destructive/10 text-destructive",
}

export function StatusBadge({
  label,
  tone,
  className,
}: {
  label: ReactNode
  tone: StatusTone
  className?: string
}) {
  return (
    <Badge className={cn("font-medium", toneClass[tone], className)}>{label}</Badge>
  )
}

const modelStatusConfig: Record<ModelStatus, { label: string; tone: StatusTone }> = {
  live: { label: "Live", tone: "positive" },
  shadow: { label: "Shadow", tone: "info" },
  retired: { label: "Retired", tone: "neutral" },
}

export function ModelStatusBadge({ status }: { status: ModelStatus }) {
  const config = modelStatusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}

const driftStatusConfig: Record<DriftState, { label: string; tone: StatusTone }> = {
  stable: { label: "Stable", tone: "positive" },
  drifting: { label: "Drifting", tone: "warning" },
}

export function DriftBadge({ drift }: { drift: DriftState | null }) {
  if (!drift) {
    return <span className="text-sm text-muted-foreground">—</span>
  }
  const config = driftStatusConfig[drift]
  return <StatusBadge label={config.label} tone={config.tone} />
}

const checkStateConfig: Record<CheckState, { label: string; tone: StatusTone }> = {
  pass: { label: "Pass", tone: "positive" },
  flag: { label: "Flag", tone: "negative" },
}

export function CheckStateBadge({ state }: { state: CheckState }) {
  const config = checkStateConfig[state]
  return <StatusBadge label={config.label} tone={config.tone} />
}
