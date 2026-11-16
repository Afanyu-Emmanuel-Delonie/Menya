"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Incident, IncidentStatus } from "@/types/alert"

const statusOptions: { value: IncidentStatus; label: string }[] = [
  { value: "investigating", label: "Investigating" },
  { value: "identified", label: "Identified" },
  { value: "monitoring", label: "Monitoring" },
  { value: "resolved", label: "Resolved" },
]

export function ChangeIncidentStatusDialog({ incident }: { incident: Incident }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<IncidentStatus>(incident.status)
  const [rootCause, setRootCause] = useState(incident.rootCause ?? "")
  const [resolution, setResolution] = useState(incident.resolution ?? "")
  const [isPending, setIsPending] = useState(false)

  const needsResolutionFields = status === "resolved"
  const canSubmit = !needsResolutionFields || (rootCause.trim() && resolution.trim())

  async function handleSubmit() {
    setIsPending(true)
    const response = await fetch(`/api/incidents/${incident.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        author: incident.owner,
        rootCause: rootCause.trim() || undefined,
        resolution: resolution.trim() || undefined,
      }),
    })
    setIsPending(false)

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    toast.success(`Status changed to ${status}`)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Change status</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change incident status</DialogTitle>
          <DialogDescription>
            This is logged on the incident&apos;s timeline and in the audit logs.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as IncidentStatus)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsResolutionFields ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rootCause">Root cause</Label>
                <textarea
                  id="rootCause"
                  rows={2}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={rootCause}
                  onChange={(event) => setRootCause(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="resolution">Resolution</Label>
                <textarea
                  id="resolution"
                  rows={2}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={resolution}
                  onChange={(event) => setResolution(event.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Root cause and resolution are required before an incident can be resolved.
              </p>
            </>
          ) : null}
        </div>

        <DialogFooter>
          <Button disabled={!canSubmit || isPending} onClick={handleSubmit}>
            {isPending ? "Saving…" : "Save status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
