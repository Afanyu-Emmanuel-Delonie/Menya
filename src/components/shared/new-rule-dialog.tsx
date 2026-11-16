"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { AlertChannel } from "@/types/alert"

const formSchema = z.object({
  category: z.enum(["model", "data_feed", "api", "consent", "fairness", "security"], "Choose a category"),
  metric: z.string().min(2, "Describe the metric"),
  operator: z.enum(["above", "below"], "Choose a comparison"),
  threshold: z.number("Enter a threshold"),
  severity: z.enum(["critical", "warning", "info"], "Choose a severity"),
  channels: z.array(z.enum(["in-app", "email"])).min(1, "Choose at least one channel"),
})

type FormValues = z.infer<typeof formSchema>

export function NewRuleDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "api",
      metric: "",
      operator: "above",
      threshold: 0,
      severity: "warning",
      channels: ["in-app"],
    },
  })

  const values = watch()

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/alert-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    toast.success("Rule created")
    reset()
    setOpen(false)
    router.refresh()
  }

  function toggleChannel(channel: AlertChannel, checked: boolean, field: { value: AlertChannel[]; onChange: (v: AlertChannel[]) => void }) {
    if (checked) field.onChange([...field.value, channel])
    else field.onChange(field.value.filter((c) => c !== channel))
  }

  const preview = `Alert me when ${values.metric || "a metric"} is ${values.operator} ${
    values.threshold || 0
  }`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        New rule
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New alert rule</DialogTitle>
          <DialogDescription>Plain-language thresholds that trigger an alert automatically.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="model">Model</SelectItem>
                      <SelectItem value="data_feed">Data feed</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="consent">Consent</SelectItem>
                      <SelectItem value="fairness">Fairness</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="severity">Severity</Label>
              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="severity" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="metric">Metric</Label>
            <Input
              id="metric"
              placeholder="e.g. API error rate"
              {...register("metric")}
              aria-invalid={!!errors.metric}
            />
            {errors.metric ? <p className="text-xs text-destructive">{errors.metric.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="operator">Comparison</Label>
              <Controller
                control={control}
                name="operator"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="operator" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="threshold">Threshold</Label>
              <Input
                id="threshold"
                type="number"
                step="any"
                {...register("threshold", { valueAsNumber: true })}
                aria-invalid={!!errors.threshold}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Channels</Label>
            <Controller
              control={control}
              name="channels"
              render={({ field }) => (
                <div className="flex gap-4">
                  {(["in-app", "email"] as const).map((channel) => (
                    <label key={channel} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={field.value.includes(channel)}
                        onCheckedChange={(checked) => toggleChannel(channel, checked === true, field)}
                      />
                      {channel}
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.channels ? (
              <p className="text-xs text-destructive">{errors.channels.message}</p>
            ) : null}
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
            {preview}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
