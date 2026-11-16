"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Flag, MessageSquare, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TimelineEntry } from "@/types/alert"

const typeIcon = {
  update: MessageSquare,
  status_change: RefreshCw,
  action: Flag,
} as const

export function IncidentTimeline({
  incidentId,
  owner,
  timeline,
}: {
  incidentId: string
  owner: string
  timeline: TimelineEntry[]
}) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isPending, setIsPending] = useState(false)

  async function handlePost() {
    if (!message.trim()) return
    setIsPending(true)
    const response = await fetch(`/api/incidents/${incidentId}/timeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim(), author: owner }),
    })
    setIsPending(false)

    if (!response.ok) {
      toast.error("Couldn't post that update")
      return
    }

    setMessage("")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col">
        {timeline.map((entry, index) => {
          const Icon = typeIcon[entry.type]
          return (
            <li key={`${entry.time}-${index}`} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-3 text-muted-foreground" />
                </span>
                {index < timeline.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
              </div>
              <div className="flex flex-col gap-0.5 pb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground">{entry.author}</span>
                  <span className="text-xs text-muted-foreground">{entry.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{entry.message}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
        <textarea
          rows={2}
          placeholder="Post an update…"
          className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <div className="flex justify-end">
          <Button size="sm" disabled={!message.trim() || isPending} onClick={handlePost}>
            {isPending ? "Posting…" : "Post update"}
          </Button>
        </div>
      </div>
    </div>
  )
}
