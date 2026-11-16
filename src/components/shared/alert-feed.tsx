import { CircleCheck } from "lucide-react"

import { AlertFeedCard } from "@/components/shared/alert-feed-card"
import { EmptyState } from "@/components/shared/empty-state"
import type { PlatformAlert } from "@/types/alert"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function parseDay(value: string) {
  const [datePart] = value.split(", ")
  const [day, mon, year] = datePart.split(" ")
  return new Date(Number(year), MONTHS.indexOf(mon), Number(day)).toDateString()
}

const NOW = new Date(2026, 10, 16)

export function AlertFeed({
  alerts,
  onChanged,
  onCreateIncident,
}: {
  alerts: PlatformAlert[]
  onChanged: () => void
  onCreateIncident: (alert: PlatformAlert) => void
}) {
  const todayKey = NOW.toDateString()
  const yesterday = new Date(NOW)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = yesterday.toDateString()

  const groups: Record<"Today" | "Yesterday" | "Earlier", PlatformAlert[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  }

  for (const alert of alerts) {
    const key = parseDay(alert.triggeredAt)
    if (key === todayKey) groups.Today.push(alert)
    else if (key === yesterdayKey) groups.Yesterday.push(alert)
    else groups.Earlier.push(alert)
  }

  const sections = (["Today", "Yesterday", "Earlier"] as const).filter(
    (key) => groups[key].length > 0
  )

  if (sections.length === 0) {
    return (
      <EmptyState
        icon={CircleCheck}
        title="All clear — no open alerts"
        description="Nothing matches these filters right now."
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {sections.map((section) => (
        <div key={section} className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {section}
          </h3>
          <div className="flex flex-col gap-2">
            {groups[section].map((alert) => (
              <AlertFeedCard
                key={alert.id}
                alert={alert}
                onChanged={onChanged}
                onCreateIncident={onCreateIncident}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
