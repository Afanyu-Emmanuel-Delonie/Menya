import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"

import { ChangeIncidentStatusDialog } from "@/components/shared/change-incident-status-dialog"
import { IncidentSeverityBadge, IncidentStatusBadge, AlertSeverityBadge } from "@/components/shared/alert-badges"
import { IncidentStatusStepper } from "@/components/shared/incident-status-stepper"
import { IncidentTimeline } from "@/components/shared/incident-timeline"
import { durationSince } from "@/lib/format"
import { getAlerts, getIncidentById } from "@/lib/data/alerts"

const NOW = new Date(2026, 10, 16, 12, 0)

export default async function IncidentDetailPage(
  props: PageProps<"/admin/alerts/incidents/[id]">
) {
  const { id } = await props.params
  const incident = await getIncidentById(id)

  if (!incident) {
    notFound()
  }

  const alerts = await getAlerts()
  const linkedAlerts = alerts.filter((alert) => incident.linkedAlertIds.includes(alert.id))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/admin/alerts?tab=incidents"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Incidents
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <IncidentSeverityBadge severity={incident.severity} />
              <IncidentStatusBadge status={incident.status} />
            </div>
            <h1 className="text-2xl font-semibold">{incident.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{incident.owner}</span>
              <span>·</span>
              <Clock className="size-3.5" />
              <span className="font-mono tabular-nums">
                {durationSince(incident.startedAt, incident.resolvedAt, NOW)}
              </span>
            </div>
          </div>
          <ChangeIncidentStatusDialog incident={incident} />
        </div>

        <IncidentStatusStepper status={incident.status} />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Timeline */}
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 xl:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Timeline</h2>
          <IncidentTimeline
            incidentId={incident.id}
            owner={incident.owner}
            timeline={incident.timeline}
          />
        </div>

        {/* Side panel — single card with dividers */}
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {/* Summary */}
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Summary</h2>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Owner</dt>
                <dd className="text-foreground">{incident.owner}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Started</dt>
                <dd className="font-mono text-xs text-foreground">{incident.startedAt}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-mono text-foreground tabular-nums">
                  {durationSince(incident.startedAt, incident.resolvedAt, NOW)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Affected */}
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Affected</h2>
            <ul className="flex flex-col gap-1.5">
              {incident.affected.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>

          {/* Linked alerts */}
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Linked alerts</h2>
            {linkedAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No alerts linked.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {linkedAlerts.map((alert) => (
                  <li key={alert.id} className="flex items-start justify-between gap-2">
                    <Link
                      href="/admin/alerts?tab=alerts"
                      className="min-w-0 truncate text-sm text-primary hover:underline"
                    >
                      {alert.title}
                    </Link>
                    <AlertSeverityBadge severity={alert.severity} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Root cause & resolution */}
          <div className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Root cause &amp; resolution</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground">Root cause</p>
                <p className="text-foreground">{incident.rootCause ?? "Not yet identified."}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground">Resolution</p>
                <p className="text-foreground">{incident.resolution ?? "Not yet resolved."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
