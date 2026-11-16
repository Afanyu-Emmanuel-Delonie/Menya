import { AlertsPanel, type Alert } from "@/components/shared/alerts-panel"
import { CreateApiKeyDialog } from "@/components/shared/create-api-key-dialog"
import { DataApisTabs } from "@/components/shared/data-apis-tabs"
import { EndpointCatalogue } from "@/components/shared/endpoint-catalogue"
import { StatCard, StatMetric } from "@/components/shared/stat-card"
import { UsagePanel } from "@/components/shared/usage-panel"
import { LineChart, type LineChartDatum } from "@/components/charts/line-chart"
import { ApiKeysTable } from "@/components/tables/api-keys-table"
import { DataFeedsExplorer } from "@/components/tables/data-feeds-explorer"
import {
  getApiEndpoints,
  getApiKeys,
  getApiUsage,
  getDataFeeds,
} from "@/lib/data/data-apis"
import { getInstitutions } from "@/lib/data/institutions"

export default async function AdminDataApisPage() {
  const [feeds, apiKeys, usage, endpoints, institutions] = await Promise.all([
    getDataFeeds(),
    getApiKeys(),
    getApiUsage(90),
    getApiEndpoints(),
    getInstitutions(),
  ])

  const problemFeeds = feeds.filter((feed) => feed.status !== "success")
  const feedAlerts: Alert[] = problemFeeds.map((feed) => ({
    id: feed.id,
    title:
      feed.status === "failed"
        ? `${feed.institutionName} upload failed`
        : `${feed.institutionName} upload delayed`,
    description: feed.errorMessage ?? "This upload has not completed on schedule.",
    time: feed.completedAt ?? feed.scheduledAt,
    severity: feed.status === "failed" ? "critical" : "warning",
    href: "/admin/data-apis?tab=feeds",
  }))

  const recentDays = usage.days.slice(-30)
  const spikeAlerts: Alert[] = recentDays
    .filter((day) => day.requests > 0 && day.errors / day.requests > 0.02)
    .map((day) => ({
      id: `spike-${day.date}`,
      title: "API error rate spiked",
      description: `Errors reached ${((day.errors / day.requests) * 100).toFixed(1)}% on ${day.date}.`,
      time: day.date,
      severity: "warning" as const,
      href: "/admin/data-apis?tab=usage",
    }))

  const attentionAlerts = [...feedAlerts, ...spikeAlerts]

  const requestsData: LineChartDatum[] = recentDays.map((day) => ({
    label: day.date.slice(5),
    value: day.requests,
  }))

  const overview = (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="On-time uploads"
          value="96%"
          footer={
            <div className="mt-1 flex items-center gap-3">
              <StatMetric label="Successful" value="182" tone="positive" />
              <StatMetric label="Failed" value="12" tone="negative" />
            </div>
          }
        />
        <StatCard label="API requests this month" value="1.3M" />
        <StatCard label="Error rate" value="0.8%" />
        <StatCard label="p95 latency" value="123 ms" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 xl:col-span-2">
          <h2 className="mb-1 text-sm font-semibold text-foreground">Requests, last 30 days</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            See the Usage tab for error rate and a 7/30/90-day breakdown.
          </p>
          <LineChart data={requestsData} />
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Needs attention</h2>
          <AlertsPanel alerts={attentionAlerts} viewAllHref="/admin/data-apis?tab=feeds" />
        </div>
      </div>
    </div>
  )

  const feedsTab = <DataFeedsExplorer data={feeds} />

  const keysTab = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CreateApiKeyDialog institutions={institutions} />
      </div>
      <ApiKeysTable data={apiKeys} />
    </div>
  )

  const usageTab = <UsagePanel usage={usage} />

  const endpointsTab = (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-1 text-sm font-semibold text-foreground">Menya API reference</h2>
      <p className="mb-2 text-xs text-muted-foreground">
        Read-only catalogue — expand a row for an example request and response.
      </p>
      <EndpointCatalogue endpoints={endpoints} />
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Data &amp; APIs</h1>
        <p className="text-sm text-muted-foreground">
          Institution data feeds, API keys, usage and the Menya API reference
        </p>
      </div>

      <DataApisTabs
        overview={overview}
        feeds={feedsTab}
        keys={keysTab}
        usage={usageTab}
        endpoints={endpointsTab}
      />
    </div>
  )
}
