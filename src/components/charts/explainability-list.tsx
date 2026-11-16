import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "cn"

import type { ExplainabilityFactor } from "@/types/models"

export function ExplainabilityList({ factors }: { factors: ExplainabilityFactor[] }) {
  const maxImpact = Math.max(...factors.map((f) => f.impact), 1)

  return (
    <ul className="flex flex-col gap-4">
      {factors.map((factor) => {
        const widthPct = (factor.impact / maxImpact) * 100
        const positive = factor.direction === "raises"
        return (
          <li key={factor.factor} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-foreground">
                {positive ? (
                  <ArrowUpRight className="size-3.5 shrink-0 text-success" />
                ) : (
                  <ArrowDownRight className="size-3.5 shrink-0 text-destructive" />
                )}
                {factor.factor}
              </span>
              <span
                className={cn(
                  "shrink-0 text-xs font-medium",
                  positive ? "text-success" : "text-destructive"
                )}
              >
                {positive ? "Raises score" : "Lowers score"}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  positive ? "bg-success" : "bg-destructive"
                )}
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
