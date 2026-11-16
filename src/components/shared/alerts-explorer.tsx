"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutList, Search, Table2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertFeed } from "@/components/shared/alert-feed"
import { AlertsTable } from "@/components/tables/alerts-table"
import { CreateIncidentDialog } from "@/components/shared/create-incident-dialog"
import type { AlertCategory, AlertSeverity, AlertStatus, PlatformAlert } from "@/types/alert"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const NOW = new Date(2026, 10, 16)

function parseDate(value: string) {
  const [datePart] = value.split(", ")
  const [day, mon, year] = datePart.split(" ")
  return new Date(Number(year), MONTHS.indexOf(mon), Number(day))
}

const dateRanges: Record<string, number | null> = {
  all: null,
  today: 0,
  week: 7,
  month: 30,
}

export function AlertsExplorer({ alerts }: { alerts: PlatformAlert[] }) {
  const router = useRouter()
  const [view, setView] = useState<"feed" | "table">("feed")
  const [search, setSearch] = useState("")
  const [severity, setSeverity] = useState("all")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [incidentTarget, setIncidentTarget] = useState<PlatformAlert | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const maxDays = dateRanges[dateRange]

    return alerts
      .filter((a) => severity === "all" || a.severity === (severity as AlertSeverity))
      .filter((a) => category === "all" || a.category === (category as AlertCategory))
      .filter((a) => status === "all" || a.status === (status as AlertStatus))
      .filter((a) => {
        if (maxDays === null || maxDays === undefined) return true
        const days = Math.floor((NOW.getTime() - parseDate(a.triggeredAt).getTime()) / 86400000)
        return days <= maxDays
      })
      .filter(
        (a) =>
          !query ||
          a.title.toLowerCase().includes(query) ||
          a.source.toLowerCase().includes(query)
      )
  }, [alerts, severity, category, status, dateRange, search])

  function handleChanged() {
    router.refresh()
  }

  function handleCreateIncident(alert: PlatformAlert) {
    setIncidentTarget(alert)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search alerts"
            className="h-10 pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={severity} onValueChange={(value) => setSeverity(value ?? "all")}>
          <SelectTrigger className="h-10 w-32">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(value) => setCategory(value ?? "all")}>
          <SelectTrigger className="h-10 w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="data_feed">Data feed</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="consent">Consent</SelectItem>
            <SelectItem value="fairness">Fairness</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
          <SelectTrigger className="h-10 w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={(value) => setDateRange(value ?? "all")}>
          <SelectTrigger className="h-10 w-32">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="icon-sm"
            variant={view === "feed" ? "secondary" : "ghost"}
            onClick={() => setView("feed")}
          >
            <LayoutList />
            <span className="sr-only">Feed view</span>
          </Button>
          <Button
            size="icon-sm"
            variant={view === "table" ? "secondary" : "ghost"}
            onClick={() => setView("table")}
          >
            <Table2 />
            <span className="sr-only">Table view</span>
          </Button>
        </div>
      </div>

      {view === "feed" ? (
        <AlertFeed alerts={filtered} onChanged={handleChanged} onCreateIncident={handleCreateIncident} />
      ) : (
        <AlertsTable alerts={filtered} onChanged={handleChanged} />
      )}

      <CreateIncidentDialog alert={incidentTarget} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
