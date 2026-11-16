export type AlertCategory = "model" | "data_feed" | "api" | "consent" | "fairness" | "security"
export type AlertSeverity = "critical" | "warning" | "info"
export type AlertStatus = "open" | "acknowledged" | "resolved"

export type PlatformAlert = {
  id: string
  title: string
  description: string
  category: AlertCategory
  severity: AlertSeverity
  status: AlertStatus
  source: string
  sourceLink: string
  triggeredAt: string
  acknowledgedBy: string | null
  resolvedAt: string | null
  incidentId: string | null
}

export type IncidentSeverity = "SEV1" | "SEV2" | "SEV3"
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved"
export type TimelineEntryType = "update" | "status_change" | "action"

export type TimelineEntry = {
  time: string
  author: string
  type: TimelineEntryType
  message: string
}

export type Incident = {
  id: string
  title: string
  severity: IncidentSeverity
  status: IncidentStatus
  owner: string
  startedAt: string
  resolvedAt: string | null
  affected: string[]
  linkedAlertIds: string[]
  timeline: TimelineEntry[]
  rootCause: string | null
  resolution: string | null
}

export type AlertChannel = "in-app" | "email"

export type AlertRule = {
  id: string
  name: string
  category: AlertCategory
  condition: string
  severity: AlertSeverity
  enabled: boolean
  channels: AlertChannel[]
}

export type NewIncidentInput = {
  title: string
  severity: IncidentSeverity
  owner: string
  affected: string
  description: string
  linkedAlertId?: string
}

export type NewAlertRuleInput = {
  category: AlertCategory
  metric: string
  operator: "above" | "below"
  threshold: number
  severity: AlertSeverity
  channels: AlertChannel[]
}
