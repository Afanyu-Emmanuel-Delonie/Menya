import Link from "next/link"

import { StatCard, StatMetric } from "@/components/shared/stat-card"
import { AlertsPanel, type Alert } from "@/components/shared/alerts-panel"
import { AuditLogTable, type AuditLogEntry } from "@/components/shared/audit-log-table"
import { LineChart, type LineChartDatum } from "@/components/charts/line-chart"
import { MiniAreaChart, type SparklineDatum } from "@/components/charts/mini-area-chart"
import { MiniBarChart } from "@/components/charts/mini-bar-chart"

const performanceData: LineChartDatum[] = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 950 },
  { label: "Mar", value: 1350 },
  { label: "Apr", value: 1900 },
  { label: "May", value: 1100 },
  { label: "Jun", value: 1250 },
  { label: "Jul", value: 1150 },
  { label: "Aug", value: 1900 },
  { label: "Sep", value: 1700 },
  { label: "Oct", value: 2000 },
  { label: "Nov", value: 1750 },
  { label: "Dec", value: 2050 },
]

const pipelineData: SparklineDatum[] = [62, 78, 55, 58, 45, 60].map((value, i) => ({
  label: `D${i + 1}`,
  value,
}))

const trafficData: SparklineDatum[] = [20, 35, 30, 45, 70, 85, 70, 50, 40, 45, 55, 40].map(
  (value, i) => ({ label: `D${i + 1}`, value })
)

const consentData: SparklineDatum[] = [30, 55, 70, 50, 35, 45, 60, 45, 30, 40, 55, 35].map(
  (value, i) => ({ label: `D${i + 1}`, value })
)

const auditEntries: AuditLogEntry[] = [
  {
    id: "1",
    time: "14:32",
    admin: "Amara Diallo",
    action: "Approved scoring model v3.1 for rollout",
    area: "Models",
    result: "Success",
    resultTone: "positive",
  },
  {
    id: "2",
    time: "14:10",
    admin: "System",
    action: "Refreshed partner API credentials",
    area: "Data & APIs",
    result: "Active",
    resultTone: "positive",
  },
  {
    id: "3",
    time: "13:47",
    admin: "Kwame Asante",
    action: "Onboarded Umoja SACCO as a new institution",
    area: "Institutions",
    result: "Active",
    resultTone: "positive",
  },
  {
    id: "4",
    time: "13:22",
    admin: "Fatima Nkosi",
    action: "Flagged Bank of Kigali for compliance review",
    area: "Institutions",
    result: "Suspended",
    resultTone: "negative",
  },
  {
    id: "5",
    time: "12:58",
    admin: "System",
    action: "Revoked an expired consent grant",
    area: "Consent Analytics",
    result: "Revoked",
    resultTone: "negative",
  },
  {
    id: "6",
    time: "12:15",
    admin: "Amara Diallo",
    action: "Disabled an inactive admin account",
    area: "Users",
    result: "Deactivated",
    resultTone: "neutral",
  },
]

const alerts: Alert[] = [
  {
    id: "score-drift",
    title: "Score drift above threshold",
    description: "Model v2.3 has moved outside its expected range.",
    time: "12 min ago",
    severity: "critical",
    href: "/admin/alerts?tab=alerts",
  },
  {
    id: "upload-delayed",
    title: "Bank of Kigali upload delayed",
    description: "The latest data upload is 2 hours late.",
    time: "2h ago",
    severity: "warning",
    href: "/admin/alerts?tab=alerts",
  },
  {
    id: "api-error-rate",
    title: "API error rate increased",
    description: "Errors reached 3.2% in the last hour.",
    time: "4h ago",
    severity: "warning",
    href: "/admin/alerts?tab=alerts",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform and model health at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          variant="accent"
          label="Model Health"
          value="Healthy"
          delta={{ value: "2.34%", direction: "up", tone: "positive" }}
          caption="Live Models"
        />
        <StatCard
          label="API Uptime"
          value="99.9%"
          delta={{ value: "0.01%", direction: "up", tone: "positive" }}
          caption="vs last month"
        />
        <StatCard label="Data Freshness" value="96%" caption="Up time 2 delayed" />
        <StatCard
          label="Active Institutions"
          value="234"
          delta={{ value: "8.34%", direction: "down", tone: "negative" }}
          caption="3 Pending"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 xl:col-span-2">
          <div className="mb-4 flex flex-col gap-0.5">
            <h2 className="text-sm font-semibold text-foreground">
              Model Performance
            </h2>
            <p className="text-xs text-muted-foreground">
              Monthly performance overview
            </p>
          </div>
          <LineChart data={performanceData} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Open Alerts
          </h2>
          <AlertsPanel alerts={alerts} viewAllHref="/admin/alerts?tab=alerts" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Data pipelines"
          value="96%"
          caption="on-time uploads"
          footer={
            <div className="mt-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <StatMetric label="Successful" value="182" tone="positive" />
                <StatMetric label="Failed" value="12" tone="negative" />
              </div>
              <MiniBarChart data={pipelineData} color="var(--chart-1)" />
              <Link
                href="/admin/data-apis"
                className="text-sm font-medium text-primary hover:underline"
              >
                View pipelines
              </Link>
            </div>
          }
        />
        <StatCard
          label="API traffic"
          value="1.3M"
          caption="request"
          footer={
            <div className="mt-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <StatMetric label="errors" value="0.8%" tone="negative" />
                <StatMetric label="average" value="123 ms" tone="neutral" />
              </div>
              <MiniAreaChart data={trafficData} />
              <Link
                href="/admin/data-apis"
                className="text-sm font-medium text-primary hover:underline"
              >
                View traffic
              </Link>
            </div>
          }
        />
        <StatCard
          label="Consent & grants"
          value="85.2%"
          caption="grant rate"
          footer={
            <div className="mt-1 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <StatMetric label="new grants" value="324" tone="positive" />
                <StatMetric label="revocations" value="27" tone="negative" />
              </div>
              <MiniAreaChart data={consentData} color="var(--chart-4)" />
              <Link
                href="/admin/consent-analytics"
                className="text-sm font-medium text-primary hover:underline"
              >
                View analytics
              </Link>
            </div>
          }
        />
      </div>

      <AuditLogTable entries={auditEntries} viewAllHref="/admin/audit-logs" />
    </div>
  )
}
