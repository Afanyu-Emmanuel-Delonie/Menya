import { Clock } from "lucide-react"

import type { ActivityEvent } from "@/types/institution"

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {events.map((event, i) => (
        <li key={event.id} className="relative flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
            {i < events.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
          </div>
          <div className="flex flex-col gap-0.5 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{event.label}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {event.time}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{event.detail}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
