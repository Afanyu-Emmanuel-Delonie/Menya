"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useConfirmAction() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function run(action: () => Promise<Response>, successMessage: string, onDone?: () => void) {
    startTransition(async () => {
      const response = await action()

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        toast.error(data?.error ?? "Something went wrong")
        setOpen(false)
        return
      }

      toast.success(successMessage)
      setOpen(false)
      onDone?.()
      router.refresh()
    })
  }

  return { open, setOpen, isPending, run }
}
