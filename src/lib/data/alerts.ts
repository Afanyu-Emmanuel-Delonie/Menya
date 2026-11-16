import alertRulesJson from "@/mock/alert-rules.json"
import alertsJson from "@/mock/alerts.json"
import incidentsJson from "@/mock/incidents.json"
import type {
  AlertRule,
  Incident,
  IncidentStatus,
  NewAlertRuleInput,
  NewIncidentInput,
  PlatformAlert,
  TimelineEntry,
} from "@/types/alert"

const alerts: PlatformAlert[] = alertsJson as PlatformAlert[]
const incidents: Incident[] = incidentsJson as Incident[]
const alertRules: AlertRule[] = alertRulesJson as AlertRule[]

export async function getAlerts(): Promise<PlatformAlert[]> {
  return alerts
}

export async function getAlertById(id: string): Promise<PlatformAlert | undefined> {
  return alerts.find((alert) => alert.id === id)
}

export async function acknowledgeAlert(id: string, by: string): Promise<PlatformAlert> {
  const alert = alerts.find((a) => a.id === id)
  if (!alert) throw new Error("Alert not found")
  alert.status = "acknowledged"
  alert.acknowledgedBy = by
  return alert
}

export async function resolveAlert(id: string): Promise<PlatformAlert> {
  const alert = alerts.find((a) => a.id === id)
  if (!alert) throw new Error("Alert not found")
  alert.status = "resolved"
  alert.resolvedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  return alert
}

export async function getIncidents(): Promise<Incident[]> {
  return incidents
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  return incidents.find((incident) => incident.id === id)
}

let nextIncidentId = incidents.length + 1

export async function createIncident(input: NewIncidentInput): Promise<Incident> {
  const now = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const incident: Incident = {
    id: `inc-${nextIncidentId++}`,
    title: input.title,
    severity: input.severity,
    status: "investigating",
    owner: input.owner,
    startedAt: now,
    resolvedAt: null,
    affected: input.affected
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    linkedAlertIds: input.linkedAlertId ? [input.linkedAlertId] : [],
    timeline: [
      {
        time: now,
        author: input.owner,
        type: "status_change",
        message: `Incident declared. ${input.description}`,
      },
    ],
    rootCause: null,
    resolution: null,
  }

  incidents.unshift(incident)

  if (input.linkedAlertId) {
    const alert = alerts.find((a) => a.id === input.linkedAlertId)
    if (alert) alert.incidentId = incident.id
  }

  return incident
}

export async function addIncidentTimelineEntry(
  id: string,
  entry: Omit<TimelineEntry, "time">
): Promise<Incident> {
  const incident = incidents.find((i) => i.id === id)
  if (!incident) throw new Error("Incident not found")

  incident.timeline.push({
    ...entry,
    time: new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  })

  return incident
}

export async function updateIncidentStatus(
  id: string,
  status: IncidentStatus,
  author: string,
  options?: { rootCause?: string; resolution?: string }
): Promise<Incident> {
  const incident = incidents.find((i) => i.id === id)
  if (!incident) throw new Error("Incident not found")

  if (status === "resolved" && !(options?.rootCause ?? incident.rootCause) ) {
    throw new Error("Root cause is required before resolving an incident")
  }
  if (status === "resolved" && !(options?.resolution ?? incident.resolution)) {
    throw new Error("Resolution is required before resolving an incident")
  }

  const now = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  incident.status = status
  if (options?.rootCause) incident.rootCause = options.rootCause
  if (options?.resolution) incident.resolution = options.resolution
  if (status === "resolved") incident.resolvedAt = now

  incident.timeline.push({
    time: now,
    author,
    type: "status_change",
    message: `Status changed to ${status}.`,
  })

  return incident
}

export async function getAlertRules(): Promise<AlertRule[]> {
  return alertRules
}

export async function toggleAlertRule(id: string, enabled: boolean): Promise<AlertRule> {
  const rule = alertRules.find((r) => r.id === id)
  if (!rule) throw new Error("Rule not found")
  rule.enabled = enabled
  return rule
}

let nextRuleId = alertRules.length + 1

export async function createAlertRule(input: NewAlertRuleInput): Promise<AlertRule> {
  const categoryLabel = input.category.replace("_", " ")
  const rule: AlertRule = {
    id: `rule-${nextRuleId++}`,
    name: `${categoryLabel} ${input.operator} ${input.threshold}`,
    category: input.category,
    condition: `Alert me when ${input.metric} is ${input.operator} ${input.threshold}`,
    severity: input.severity,
    enabled: true,
    channels: input.channels,
  }
  alertRules.unshift(rule)
  return rule
}
