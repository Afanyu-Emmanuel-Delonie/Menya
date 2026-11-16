import * as React from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "cn"

export type StatDelta = {
  value: string
  direction: "up" | "down"
  tone: "positive" | "negative"
}

export function StatCard({
  label,
  value,
  caption,
  delta,
  footer,
  variant = "default",
  className,
  valueClassName,
}: {
  label: string
  value: string
  caption?: string
  delta?: StatDelta
  footer?: React.ReactNode
  variant?: "default" | "accent"
  className?: string
  valueClassName?: string
}) {
  const isAccent = variant === "accent"

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-4",
        isAccent
          ? "border-transparent bg-kivu-950 text-white"
          : "border-border bg-card text-card-foreground",
        className
      )}
    >
      <span
        className={cn(
          "text-sm font-medium",
          isAccent ? "text-white/70" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <span className={cn("font-heading text-2xl font-semibold", valueClassName)}>
        {value}
      </span>
      {delta ? (
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            isAccent
              ? "bg-white/15 text-white"
              : delta.tone === "positive"
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
          )}
        >
          {delta.direction === "up" ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {delta.value}
        </span>
      ) : null}
      {caption ? (
        <span
          className={cn(
            "text-xs",
            isAccent ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {caption}
        </span>
      ) : null}
      {footer}
    </div>
  )
}

export function StatMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string
  tone?: "positive" | "negative" | "neutral"
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "positive" && "bg-success",
          tone === "negative" && "bg-destructive",
          tone === "neutral" && "bg-muted-foreground"
        )}
      />
      <span className="font-medium text-foreground tabular-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  )
}
