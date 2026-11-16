import {
  Building2,
  HeartHandshake,
  Landmark,
  Users,
  type LucideIcon,
} from "lucide-react"

import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { ApiHealthStatus, InstitutionStatus, InstitutionType } from "@/types/institution"

const typeConfig: Record<InstitutionType, { label: string; icon: LucideIcon }> = {
  bank: { label: "Bank", icon: Landmark },
  sacco: { label: "SACCO", icon: Building2 },
  savings_group: { label: "Savings group", icon: Users },
  inclusion_partner: { label: "Inclusion partner", icon: HeartHandshake },
}

export function InstitutionTypeTag({ type }: { type: InstitutionType }) {
  const config = typeConfig[type]
  const Icon = config.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-3.5 shrink-0" />
      {config.label}
    </span>
  )
}

const statusConfig: Record<InstitutionStatus, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "positive" },
  pending: { label: "Pending", tone: "warning" },
  suspended: { label: "Suspended", tone: "negative" },
}

export function InstitutionStatusBadge({ status }: { status: InstitutionStatus }) {
  const config = statusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}

const apiStatusConfig: Record<ApiHealthStatus, { label: string; tone: StatusTone }> = {
  healthy: { label: "Healthy", tone: "positive" },
  degraded: { label: "Degraded", tone: "warning" },
  down: { label: "Down", tone: "negative" },
}

export function ApiStatusBadge({ status }: { status: ApiHealthStatus }) {
  const config = apiStatusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}

export { typeConfig as institutionTypeConfig }
