"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const institutionTypeOptions = [
  { value: "bank", label: "Bank" },
  { value: "sacco", label: "SACCO" },
  { value: "savings_group", label: "Savings group" },
  { value: "inclusion_partner", label: "Inclusion partner" },
] as const

const formSchema = z.object({
  name: z.string().min(2, "Enter the institution's name"),
  type: z.enum(["bank", "sacco", "savings_group", "inclusion_partner"], "Choose a type"),
  district: z.string().min(2, "Enter a district"),
  contactName: z.string().min(2, "Enter a contact name"),
  contactEmail: z.string().email("Enter a valid email"),
})

type FormValues = z.infer<typeof formSchema>

export function AddInstitutionSheet() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", district: "", contactName: "", contactEmail: "" },
  })

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      toast.error(data?.error ?? "Something went wrong")
      return
    }

    toast.success(`${values.name} added — pending approval`)
    reset()
    setOpen(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="h-10" />}>
        <Plus />
        Add institution
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add institution</SheetTitle>
          <SheetDescription>
            New institutions join as pending until a platform admin approves them.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-institution-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger id="type" className="w-full" aria-invalid={!!errors.type}>
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type ? (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="district">District</Label>
            <Input id="district" {...register("district")} aria-invalid={!!errors.district} />
            {errors.district ? (
              <p className="text-xs text-destructive">{errors.district.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactName">Contact name</Label>
            <Input
              id="contactName"
              {...register("contactName")}
              aria-invalid={!!errors.contactName}
            />
            {errors.contactName ? (
              <p className="text-xs text-destructive">{errors.contactName.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register("contactEmail")}
              aria-invalid={!!errors.contactEmail}
            />
            {errors.contactEmail ? (
              <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
            ) : null}
          </div>
        </form>

        <SheetFooter className="flex-row justify-end">
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button type="submit" form="add-institution-form" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : "Add institution"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
