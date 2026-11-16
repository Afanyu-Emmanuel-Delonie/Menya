import { cn } from "cn"

import type { IncidentStatus } from "@/types/alert"

const steps: { value: IncidentStatus; label: string }[] = [
  { value: "investigating", label: "Investigating" },
  { value: "identified", label: "Identified" },
  { value: "monitoring", label: "Monitoring" },
  { value: "resolved", label: "Resolved" },
]

export function IncidentStatusStepper({ status }: { status: IncidentStatus }) {
  const currentIndex = steps.findIndex((step) => step.value === status)

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const done = index <= currentIndex
        return (
          <div key={step.value} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px] font-medium",
                  done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-xs",
                  done ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                className={cn(
                  "mx-2 mb-4 h-px w-8 sm:w-12",
                  index < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
