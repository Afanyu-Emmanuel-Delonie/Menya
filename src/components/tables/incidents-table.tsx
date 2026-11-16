"use client"

import Link from "next/link"
import { CircleCheck, Clock } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/shared/empty-state"
import { IncidentSeverityBadge, IncidentStatusBadge } from "@/components/shared/alert-badges"
import { durationSince } from "@/lib/format"
import type { Incident } from "@/types/alert"

const NOW = new Date(2026, 10, 16, 12, 0)

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function IncidentsTable({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={CircleCheck}
        title="No incidents"
        description="Declared incidents will show up here."
      />
    )
  }

  const sorted = [...incidents].sort((a, b) => {
    const aActive = a.status !== "resolved"
    const bActive = b.status !== "resolved"
    if (aActive !== bActive) return aActive ? -1 : 1
    return 0
  })

  return (
    <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
      {sorted.map((incident) => (
        <Link
          key={incident.id}
          href={`/admin/alerts/incidents/${incident.id}`}
          className="flex flex-col gap-2 p-4 hover:bg-muted/40 transition-colors"
        >
          {/* Top row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <IncidentSeverityBadge severity={incident.severity} />
              <IncidentStatusBadge status={incident.status} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span className="font-mono tabular-nums">
                {durationSince(incident.startedAt, incident.resolvedAt, NOW)}
              </span>
            </div>
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-foreground leading-snug">{incident.title}</p>

          {/* Bottom row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {initials(incident.owner)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{incident.owner}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{incident.affected.join(", ")}</span>
              <span>{incident.startedAt}</span>
              {incident.linkedAlertIds.length > 0 ? (
                <span>{incident.linkedAlertIds.length} alert{incident.linkedAlertIds.length !== 1 ? "s" : ""}</span>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
