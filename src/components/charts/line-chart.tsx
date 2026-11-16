"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type LineChartDatum = {
  label: string
  value: number
}

const chartConfig = {
  value: {
    label: "Performance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function LineChart({
  data,
  valueFormatter = (v: number) => v.toLocaleString(),
}: {
  data: LineChartDatum[]
  valueFormatter?: (value: number) => string
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickMargin={8}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
          width={32}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              formatter={(value) => valueFormatter(value as number)}
              indicator="line"
            />
          }
        />
        <Area
          type="natural"
          dataKey="value"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillValue)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--background)", fill: "var(--chart-1)" }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
