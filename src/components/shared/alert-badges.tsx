import {
  Cpu,
  Database,
  Info,
  OctagonAlert,
  Scale,
  Shield,
  ShieldCheck,
  TriangleAlert,
  Webhook,
  type LucideIcon,
} from "lucide-react"

import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type {
  AlertCategory,
  AlertSeverity,
  AlertStatus,
  IncidentSeverity,
  IncidentStatus,
} from "@/types/alert"

export const severityConfig: Record<
  AlertSeverity,
  { label: string; tone: StatusTone; icon: LucideIcon }
> = {
  critical: { label: "Critical", tone: "negative", icon: OctagonAlert },
  warning: { label: "Warning", tone: "warning", icon: TriangleAlert },
  info: { label: "Info", tone: "info", icon: Info },
}

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  const config = severityConfig[severity]
  const Icon = config.icon
  return (
    <StatusBadge
      label={
        <span className="inline-flex items-center gap-1">
          <Icon className="size-3" />
          {config.label}
        </span>
      }
      tone={config.tone}
    />
  )
}

const alertStatusConfig: Record<AlertStatus, { label: string; tone: StatusTone }> = {
  open: { label: "Open", tone: "negative" },
  acknowledged: { label: "Acknowledged", tone: "warning" },
  resolved: { label: "Resolved", tone: "positive" },
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const config = alertStatusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}

const categoryConfig: Record<AlertCategory, { label: string; icon: LucideIcon }> = {
  model: { label: "Model", icon: Cpu },
  data_feed: { label: "Data feed", icon: Database },
  api: { label: "API", icon: Webhook },
  consent: { label: "Consent", icon: ShieldCheck },
  fairness: { label: "Fairness", icon: Scale },
  security: { label: "Security", icon: Shield },
}

export function CategoryTag({ category }: { category: AlertCategory }) {
  const config = categoryConfig[category]
  const Icon = config.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3 shrink-0" />
      {config.label}
    </span>
  )
}

export function categoryLabel(category: AlertCategory) {
  return categoryConfig[category].label
}

const incidentSeverityConfig: Record<IncidentSeverity, StatusTone> = {
  SEV1: "negative",
  SEV2: "warning",
  SEV3: "info",
}

export function IncidentSeverityBadge({ severity }: { severity: IncidentSeverity }) {
  return <StatusBadge label={severity} tone={incidentSeverityConfig[severity]} className="font-mono" />
}

const incidentStatusConfig: Record<IncidentStatus, { label: string; tone: StatusTone }> = {
  investigating: { label: "Investigating", tone: "negative" },
  identified: { label: "Identified", tone: "warning" },
  monitoring: { label: "Monitoring", tone: "info" },
  resolved: { label: "Resolved", tone: "positive" },
}

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const config = incidentStatusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}
