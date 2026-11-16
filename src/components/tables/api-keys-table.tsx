"use client"

import { useState } from "react"
import { MoreHorizontal, ShieldOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiKeyStatusBadge, EnvironmentBadge } from "@/components/shared/data-apis-badges"
import { EmptyState } from "@/components/shared/empty-state"
import { RevokeApiKeyDialog } from "@/components/shared/revoke-api-key-dialog"
import { KeyRound } from "lucide-react"
import type { ApiKey } from "@/types/data-apis"

export function ApiKeysTable({ data }: { data: ApiKey[] }) {
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null)
  const [open, setOpen] = useState(false)

  if (data.length === 0) {
    return (
      <EmptyState
        icon={KeyRound}
        title="No API keys yet"
        description="Create a key to let an institution connect to Menya's API."
      />
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Institution</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Created / last used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((key) => (
            <TableRow key={key.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{key.institutionName}</span>
                  <span className="text-xs text-muted-foreground">{key.label}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm text-muted-foreground">
                  {key.prefix}••••{key.last4}
                </span>
              </TableCell>
              <TableCell>
                <EnvironmentBadge environment={key.environment} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col text-xs text-muted-foreground">
                  <span>{key.createdAt}</span>
                  <span>{key.lastUsedAt ?? "Never used"}</span>
                </div>
              </TableCell>
              <TableCell>
                <ApiKeyStatusBadge status={key.status} />
              </TableCell>
              <TableCell>
                {key.status === "active" ? (
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontal />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setRevokeTarget(key)
                            setOpen(true)
                          }}
                        >
                          <ShieldOff />
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RevokeApiKeyDialog apiKey={revokeTarget} open={open} onOpenChange={setOpen} />
    </>
  )
}
