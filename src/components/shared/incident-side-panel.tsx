import Link from "next/link"

import { AlertSeverityBadge } from "@/components/shared/alert-badges"
import { durationSince } from "@/lib/format"
import type { Incident, PlatformAlert } from "@/types/alert"

const NOW = new Date(2026, 10, 16, 12, 0)

export function IncidentSidePanel({
  incident,
  linkedAlerts,
}: {
  incident: Incident
  linkedAlerts: PlatformAlert[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4">
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

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Affected</h2>
        <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {incident.affected.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Linked alerts</h2>
        {linkedAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alerts linked to this incident.</p>
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

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Root cause &amp; resolution</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Root cause</p>
            <p className="text-foreground">{incident.rootCause ?? "Not yet identified."}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Resolution</p>
            <p className="text-foreground">{incident.resolution ?? "Not yet resolved."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
