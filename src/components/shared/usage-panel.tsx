"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { LineChart, type LineChartDatum } from "@/components/charts/line-chart"
import { MiniAreaChart, type SparklineDatum } from "@/components/charts/mini-area-chart"
import { RankedMeterList } from "@/components/charts/ranked-meter-list"
import type { ApiUsageSummary } from "@/types/data-apis"

const ranges = [7, 30, 90] as const

export function UsagePanel({ usage }: { usage: ApiUsageSummary }) {
  const [range, setRange] = useState<(typeof ranges)[number]>(30)

  const days = useMemo(() => usage.days.slice(-range), [usage.days, range])

  const requestsData: LineChartDatum[] = days.map((day) => ({
    label: day.date.slice(5),
    value: day.requests,
  }))

  const errorRateData: SparklineDatum[] = days.map((day) => ({
    label: day.date.slice(5),
    value: day.requests ? Math.round((day.errors / day.requests) * 1000) / 10 : 0,
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-1">
        {ranges.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={range === value ? "secondary" : "ghost"}
            onClick={() => setRange(value)}
          >
            {value}d
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Requests</h2>
        <LineChart data={requestsData} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-1 text-sm font-semibold text-foreground">Error rate</h2>
        <p className="mb-2 text-xs text-muted-foreground">
          Share of requests that errored, per day.
        </p>
        <MiniAreaChart data={errorRateData} color="var(--destructive)" className="h-28" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Requests by endpoint</h2>
          <RankedMeterList
            items={usage.byEndpoint.map((e) => ({ label: e.path, value: e.requests }))}
            monospaceLabel
          />
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Errors by status code</h2>
          <RankedMeterList
            items={usage.byStatusCode.map((s) => ({
              label: s.code,
              value: s.count,
              tone: s.code.startsWith("2") ? "positive" : "negative",
            }))}
            monospaceLabel
          />
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Top institutions by traffic
          </h2>
          <RankedMeterList
            items={usage.byInstitution.map((i) => ({
              label: i.institutionName,
              value: i.requests,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
