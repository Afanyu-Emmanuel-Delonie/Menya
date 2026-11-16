"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useConfirmAction } from "@/hooks/use-confirm-action"
import type { Institution } from "@/types/institution"

export function InstitutionRowActions({ institution }: { institution: Institution }) {
  const { open, setOpen, isPending, run } = useConfirmAction()
  const [pendingStatus, setPendingStatus] = useState<"active" | "suspended" | null>(null)

  function openConfirm(status: "active" | "suspended") {
    setPendingStatus(status)
    setOpen(true)
  }

  function handleConfirm() {
    if (!pendingStatus) return
    run(
      () =>
        fetch(`/api/institutions/${institution.id}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: pendingStatus }),
        }),
      pendingStatus === "active"
        ? `${institution.name} approved`
        : `${institution.name} suspended`
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontal />
          <span className="sr-only">Actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/admin/institutions/${institution.id}`} />}>
            <Eye />
            View
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {institution.status !== "active" ? (
            <DropdownMenuItem onClick={() => openConfirm("active")}>Approve</DropdownMenuItem>
          ) : null}
          {institution.status === "active" ? (
            <DropdownMenuItem variant="destructive" onClick={() => openConfirm("suspended")}>
              Suspend
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={
          pendingStatus === "active"
            ? `Approve ${institution.name}?`
            : `Suspend ${institution.name}?`
        }
        description={
          pendingStatus === "active"
            ? "This institution will be able to upload data and score members."
            : "This institution's data uploads and scoring will stop until it's reinstated."
        }
        confirmLabel={pendingStatus === "active" ? "Approve" : "Suspend"}
        confirmVariant={pendingStatus === "active" ? "default" : "destructive"}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </>
  )
}
