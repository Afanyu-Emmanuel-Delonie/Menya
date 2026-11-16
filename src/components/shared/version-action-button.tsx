"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { VersionAction } from "@/lib/data/models"

export function VersionActionButton({
  modelId,
  modelName,
  version,
  action,
}: {
  modelId: string
  modelName: string
  version: string
  action: VersionAction
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const label = action === "promote" ? "Promote" : "Rollback"

  function handleConfirm() {
    startTransition(async () => {
      const response = await fetch(`/api/models/${modelId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, action }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        toast.error(body?.error ?? "Something went wrong")
        setOpen(false)
        return
      }

      toast.success(
        action === "promote"
          ? `${modelName} ${version} is now live`
          : `${modelName} rolled back to ${version}`
      )
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "promote" ? `Promote ${version} to live?` : `Roll back to ${version}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === "promote"
              ? `${modelName} ${version} will start scoring live traffic. The current live version will be retired.`
              : `${modelName} will serve ${version} again. The current live version will be retired.`}{" "}
            This is written to the audit logs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Working…" : label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
