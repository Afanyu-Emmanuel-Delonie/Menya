"use client"

import { Bar, BarChart } from "recharts"
import { cn } from "cn"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SparklineDatum } from "@/components/charts/mini-area-chart"

const chartConfig = {
  value: { label: "Value" },
} satisfies ChartConfig

export function MiniBarChart({
  data,
  color = "var(--chart-1)",
  className,
}: {
  data: SparklineDatum[]
  color?: string
  className?: string
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-16 w-full", className)}
    >
      <BarChart
        data={data}
        margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
        barCategoryGap="35%"
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel indicator="line" />}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[3, 3, 0, 0]}
          isAnimationActive={false}
          opacity={0.85}
        />
      </BarChart>
    </ChartContainer>
  )
}
