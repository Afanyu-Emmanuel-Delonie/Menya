"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Siren } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IncidentFormFields } from "@/components/shared/incident-form-fields"
import { incidentFormSchema, type IncidentFormValues } from "@/lib/schemas/incident"

export function DeclareIncidentSheet() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
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

  async function onSubmit(values: IncidentFormValues) {
    const response = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    toast.success(`Incident declared: ${values.title}`)
    reset()
    setOpen(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="h-10" />}>
        <Siren />
        Declare incident
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Declare incident</SheetTitle>
          <SheetDescription>
            Use this for a serious problem someone needs to own and work through to resolution.
          </SheetDescription>
        </SheetHeader>
        <form
          id="declare-incident-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <IncidentFormFields control={control} register={register} errors={errors} />
        </form>
        <SheetFooter className="flex-row justify-end">
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button type="submit" form="declare-incident-form" disabled={isSubmitting}>
            {isSubmitting ? "Declaring…" : "Declare incident"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
