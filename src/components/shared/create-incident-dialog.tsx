"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { IncidentFormFields } from "@/components/shared/incident-form-fields"
import { incidentFormSchema, type IncidentFormValues } from "@/lib/schemas/incident"
import type { PlatformAlert } from "@/types/alert"

export function CreateIncidentDialog({
  alert,
  open,
  onOpenChange,
}: {
  alert: PlatformAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: { title: "", severity: "SEV2", owner: "", affected: "", description: "" },
  })

  useEffect(() => {
    if (alert) {
      reset({
        title: alert.title,
        severity: alert.severity === "critical" ? "SEV1" : "SEV2",
        owner: "",
        affected: alert.source,
        description: alert.description,
      })
    }
  }, [alert, reset])

  async function onSubmit(values: IncidentFormValues) {
    const response = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, linkedAlertId: alert?.id }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    toast.success(`Incident declared: ${values.title}`)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create incident</DialogTitle>
          <DialogDescription>Prefilled from the alert — adjust anything before declaring.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <IncidentFormFields control={control} register={register} errors={errors} />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Declaring…" : "Declare incident"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
