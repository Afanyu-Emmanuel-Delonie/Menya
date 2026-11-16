import Link from "next/link"
import { AlertTriangle, ArrowRight, OctagonAlert } from "lucide-react"
import { cn } from "cn"

export type Alert = {
  id: string
  title: string
  description: string
  time: string
  severity: "critical" | "warning"
  href: string
}

const severityConfig = {
  critical: {
    icon: OctagonAlert,
    dot: "bg-destructive",
    badge: "bg-destructive/10 text-destructive",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    dot: "bg-warning",
    badge: "bg-warning/10 text-warning",
    label: "Warning",
  },
} as const

export function AlertsPanel({
  alerts,
  viewAllHref = "#",
}: {
  alerts: Alert[]
  viewAllHref?: string
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col divide-y divide-border">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon
          return (
            <Link
              key={alert.id}
              href={alert.href}
              className="group flex items-start gap-3 py-3 transition-colors hover:bg-muted/50 px-1 rounded-lg"
            >
              <div className={cn("mt-1 size-2 shrink-0 rounded-full", config.dot)} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {alert.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {alert.time}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {alert.description}
                </span>
                <span className={cn("mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-medium", config.badge)}>
                  {config.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <Link
        href={viewAllHref}
        className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium text-primary hover:underline"
      >
        View all alerts
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  )
}
