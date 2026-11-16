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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiKey } from "@/types/data-apis"

export function RevokeApiKeyDialog({
  apiKey,
  open,
  onOpenChange,
}: {
  apiKey: ApiKey | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [confirmText, setConfirmText] = useState("")
  const [isPending, setIsPending] = useState(false)
  const matches = apiKey ? confirmText.trim().toLowerCase() === apiKey.institutionName.toLowerCase() : false

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) setConfirmText("")
  }

  async function handleRevoke() {
    if (!apiKey || !matches) return
    setIsPending(true)
    const response = await fetch(`/api/api-keys/${apiKey.id}/revoke`, { method: "POST" })
    setIsPending(false)

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    toast.success(`"${apiKey.label}" revoked`)
    handleOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {apiKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Revoke &quot;{apiKey.label}&quot;?</DialogTitle>
              <DialogDescription>
                {apiKey.institutionName} will immediately lose access with this key. This can&apos;t
                be undone. Type the institution name to confirm.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm-name">{apiKey.institutionName}</Label>
              <Input
                id="confirm-name"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={apiKey.institutionName}
              />
            </div>
            <DialogFooter>
              <Button variant="destructive" disabled={!matches || isPending} onClick={handleRevoke}>
                {isPending ? "Revoking…" : "Revoke key"}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
