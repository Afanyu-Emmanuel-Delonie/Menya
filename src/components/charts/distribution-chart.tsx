"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ScoreBucket } from "@/types/models"

export function DistributionChart({
  data,
  trainingData,
}: {
  data: ScoreBucket[]
  trainingData?: ScoreBucket[]
}) {
  const merged = data.map((bucket, i) => ({
    bucket: bucket.bucket,
    current: bucket.count,
    training: trainingData?.[i]?.count,
  }))

  const chartConfig: ChartConfig = trainingData
    ? {
        current: { label: "This month" },
        training: { label: "Training data" },
      }
    : {
        current: { label: "Applicants" },
      }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
      <BarChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickMargin={8}
          width={36}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {trainingData ? (
          <Legend content={<ChartLegendContent />} verticalAlign="top" />
        ) : null}
        <Bar
          dataKey="current"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
          isAnimationActive={false}
        />
        {trainingData ? (
          <Bar
            dataKey="training"
            fill="var(--muted-foreground)"
            fillOpacity={0.45}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            isAnimationActive={false}
          />
        ) : null}
      </BarChart>
    </ChartContainer>
  )
}
