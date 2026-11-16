import { cn } from "cn"

export type RankedMeterItem = {
  label: string
  value: number
  tone?: "positive" | "negative" | "neutral"
}

const toneBar: Record<"positive" | "negative" | "neutral" | "default", string> = {
  positive: "bg-success",
  negative: "bg-destructive",
  neutral: "bg-muted-foreground",
  default: "bg-primary",
}

export function RankedMeterList({
  items,
  valueFormatter = (value: number) => value.toLocaleString(),
  monospaceLabel = false,
}: {
  items: RankedMeterItem[]
  valueFormatter?: (value: number) => string
  monospaceLabel?: boolean
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label} className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span
              className={cn(
                "min-w-0 truncate text-foreground",
                monospaceLabel && "font-mono text-xs"
              )}
            >
              {item.label}
            </span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
              {valueFormatter(item.value)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", toneBar[item.tone ?? "default"])}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
