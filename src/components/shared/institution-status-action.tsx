"use client"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useConfirmAction } from "@/hooks/use-confirm-action"
import type { InstitutionStatus } from "@/types/institution"

export function InstitutionStatusAction({
  institutionId,
  institutionName,
  status,
}: {
  institutionId: string
  institutionName: string
  status: InstitutionStatus
}) {
  const { open, setOpen, isPending, run } = useConfirmAction()
  const nextStatus: "active" | "suspended" = status === "active" ? "suspended" : "active"
  const label = nextStatus === "active" ? "Approve" : "Suspend"

  function handleConfirm() {
    run(
      () =>
        fetch(`/api/institutions/${institutionId}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }),
      nextStatus === "active" ? `${institutionName} approved` : `${institutionName} suspended`
    )
  }

  return (
    <>
      <Button
        variant={nextStatus === "suspended" ? "destructive" : "default"}
        className="h-10"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={nextStatus === "active" ? `Approve ${institutionName}?` : `Suspend ${institutionName}?`}
        description={
          nextStatus === "active"
            ? "This institution will be able to upload data and score members."
            : "This institution's data uploads and scoring will stop until it's reinstated."
        }
        confirmLabel={label}
        confirmVariant={nextStatus === "suspended" ? "destructive" : "default"}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </>
  )
}
