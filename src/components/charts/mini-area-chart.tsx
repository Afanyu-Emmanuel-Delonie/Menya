"use client"

import * as React from "react"
import { Area, AreaChart } from "recharts"
import { cn } from "cn"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type SparklineDatum = {
  label: string
  value: number
}

const chartConfig = {
  value: { label: "Value" },
} satisfies ChartConfig

export function MiniAreaChart({
  data,
  color = "var(--chart-1)",
  className,
}: {
  data: SparklineDatum[]
  color?: string
  className?: string
}) {
  const gradientId = React.useId().replace(/:/g, "")

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-16 w-full", className)}
    >
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="line" />}
        />
        <Area
          type="natural"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#fill-${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}
