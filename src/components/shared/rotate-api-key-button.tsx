"use client"

import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useConfirmAction } from "@/hooks/use-confirm-action"

export function RotateApiKeyButton({
  institutionId,
  institutionName,
}: {
  institutionId: string
  institutionName: string
}) {
  const { open, setOpen, isPending, run } = useConfirmAction()

  function handleConfirm() {
    run(
      () => fetch(`/api/institutions/${institutionId}/rotate-key`, { method: "POST" }),
      `API key rotated for ${institutionName}`
    )
  }

  return (
    <>
      <Button variant="outline" className="h-10" onClick={() => setOpen(true)}>
        <KeyRound />
        Rotate key
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Rotate this API key?"
        description={`The current key will stop working immediately. ${institutionName} will need to update its integration with the new key.`}
        confirmLabel="Rotate key"
        confirmVariant="destructive"
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </>
  )
}
