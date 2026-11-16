import { AlertsExplorer } from "@/components/shared/alerts-explorer"
import { AlertsTabs } from "@/components/shared/alerts-tabs"
import { DeclareIncidentSheet } from "@/components/shared/declare-incident-sheet"
import { NewRuleDialog } from "@/components/shared/new-rule-dialog"
import { StatCard } from "@/components/shared/stat-card"
import { AlertRulesTable } from "@/components/tables/alert-rules-table"
import { IncidentsTable } from "@/components/tables/incidents-table"
import { getAlertRules, getAlerts, getIncidents } from "@/lib/data/alerts"
import { durationBetween } from "@/lib/format"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const NOW = new Date(2026, 10, 16)

function parseDate(value: string) {
  const [datePart] = value.split(", ")
  const [day, mon, year] = datePart.split(" ")
  return new Date(Number(year), MONTHS.indexOf(mon), Number(day))
}

function daysAgo(date: Date) {
  return Math.floor((NOW.getTime() - date.getTime()) / 86400000)
}

export default async function AdminAlertsPage() {
  const [alerts, incidents, rules] = await Promise.all([
    getAlerts(),
    getIncidents(),
    getAlertRules(),
  ])

  const openAlerts = alerts.filter((a) => a.status !== "resolved")
  const criticalOpen = openAlerts.filter((a) => a.severity === "critical")
  const activeIncidents = incidents.filter((i) => i.status !== "resolved")

  const resolvedIncidents = incidents.filter((i) => i.resolvedAt)
  const mttrMinutes = resolvedIncidents.length
    ? Math.round(
        resolvedIncidents.reduce((sum, incident) => {
          const label = durationBetween(incident.startedAt, incident.resolvedAt)
          const hoursMatch = /(\d+)h/.exec(label)
          const minsMatch = /(\d+)m/.exec(label)
          const hours = hoursMatch ? Number(hoursMatch[1]) : 0
          const mins = minsMatch ? Number(minsMatch[1]) : 0
          return sum + hours * 60 + mins
        }, 0) / resolvedIncidents.length
      )
    : 0
  const mttrLabel =
    mttrMinutes >= 60 ? `${Math.floor(mttrMinutes / 60)}h ${mttrMinutes % 60}m` : `${mttrMinutes}m`

  const thisWeek = alerts.filter((a) => daysAgo(parseDate(a.triggeredAt)) <= 7).length
  const lastWeek = alerts.filter((a) => {
    const d = daysAgo(parseDate(a.triggeredAt))
    return d > 7 && d <= 14
  }).length
  const weekDelta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0

  const alertsTab = <AlertsExplorer alerts={alerts} />

  const incidentsTab = <IncidentsTable incidents={incidents} />

  const rulesTab = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NewRuleDialog />
      </div>
      <AlertRulesTable rules={rules} />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Alerts &amp; Incidents</h1>
          <p className="text-sm text-muted-foreground">
            Catch problems early and track them until they&apos;re fixed
          </p>
        </div>
        <DeclareIncidentSheet />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Open alerts"
          value={String(openAlerts.length)}
          caption={`${criticalOpen.length} critical`}
        />
        <StatCard label="Active incidents" value={String(activeIncidents.length)} />
        <StatCard label="Mean time to resolve" value={mttrLabel} />
        <StatCard
          label="Alerts this week"
          value={String(thisWeek)}
          delta={
            lastWeek > 0
              ? {
                  value: `${Math.abs(weekDelta)}%`,
                  direction: weekDelta >= 0 ? "up" : "down",
                  tone: weekDelta >= 0 ? "negative" : "positive",
                }
              : undefined
          }
          caption="vs last week"
        />
      </div>

      <AlertsTabs alerts={alertsTab} incidents={incidentsTab} rules={rulesTab} />
    </div>
  )
}
