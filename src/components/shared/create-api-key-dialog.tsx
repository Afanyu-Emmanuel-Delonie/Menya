"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { KeyRound, Plus, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/shared/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Institution } from "@/types/institution"
import type { NewApiKeyResult } from "@/types/data-apis"

const formSchema = z.object({
  institutionId: z.string().min(1, "Choose an institution"),
  label: z.string().min(2, "Give this key a label"),
  environment: z.enum(["live", "sandbox"], "Choose an environment"),
})

type FormValues = z.infer<typeof formSchema>

export function CreateApiKeyDialog({ institutions }: { institutions: Institution[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [created, setCreated] = useState<NewApiKeyResult | null>(null)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { institutionId: "", label: "", environment: "live" },
  })

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    const result = (await response.json()) as NewApiKeyResult
    setCreated(result)
    router.refresh()
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      reset()
      setCreated(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus />
        Create key
      </DialogTrigger>
      <DialogContent>
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle>Key created</DialogTitle>
              <DialogDescription>
                Copy this key now — Menya won&apos;t show the full value again.
              </DialogDescription>
            </DialogHeader>
            <CodeBlock code={created.fullKey} label={created.key.label} />
            <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 p-3 text-xs text-warning">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
              Store this key securely. If it&apos;s lost, revoke it and create a new one.
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Scoped to one institution. The full key is only shown once.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="institutionId">Institution</Label>
                <Controller
                  control={control}
                  name="institutionId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="institutionId" className="w-full">
                        <SelectValue placeholder="Choose an institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.institutionId ? (
                  <p className="text-xs text-destructive">{errors.institutionId.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="label">Label</Label>
                <Input id="label" placeholder="e.g. Core banking integration" {...register("label")} />
                {errors.label ? (
                  <p className="text-xs text-destructive">{errors.label.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="environment">Environment</Label>
                <Controller
                  control={control}
                  name="environment"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="environment" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  <KeyRound />
                  {isSubmitting ? "Creating…" : "Create key"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
