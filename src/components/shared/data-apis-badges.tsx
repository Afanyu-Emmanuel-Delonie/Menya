import { Building2, Landmark, Smartphone, Users, type LucideIcon } from "lucide-react"

import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type {
  ApiKeyEnvironment,
  ApiKeyStatus,
  FeedSource,
  FeedStatus,
} from "@/types/data-apis"

const feedStatusConfig: Record<FeedStatus, { label: string; tone: StatusTone }> = {
  success: { label: "Success", tone: "positive" },
  delayed: { label: "Delayed", tone: "warning" },
  failed: { label: "Failed", tone: "negative" },
}

export function FeedStatusBadge({ status }: { status: FeedStatus }) {
  const config = feedStatusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}

const sourceConfig: Record<FeedSource, { label: string; icon: LucideIcon }> = {
  core_banking: { label: "Core banking", icon: Landmark },
  momo: { label: "MoMo", icon: Smartphone },
  sacco_ledger: { label: "SACCO ledger", icon: Building2 },
  group_records: { label: "Group records", icon: Users },
}

export function FeedSourceTag({ source }: { source: FeedSource }) {
  const config = sourceConfig[source]
  const Icon = config.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3 shrink-0" />
      {config.label}
    </span>
  )
}

export function EnvironmentBadge({ environment }: { environment: ApiKeyEnvironment }) {
  return (
    <StatusBadge
      label={environment === "live" ? "Live" : "Sandbox"}
      tone={environment === "live" ? "positive" : "info"}
    />
  )
}

const keyStatusConfig: Record<ApiKeyStatus, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "positive" },
  revoked: { label: "Revoked", tone: "neutral" },
}

export function ApiKeyStatusBadge({ status }: { status: ApiKeyStatus }) {
  const config = keyStatusConfig[status]
  return <StatusBadge label={config.label} tone={config.tone} />
}
