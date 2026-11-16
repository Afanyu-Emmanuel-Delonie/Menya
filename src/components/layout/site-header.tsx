"use client"

import { Bell, Search } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NavUser, type AppUser } from "@/components/layout/nav-user"

export function SiteHeader({
  user,
  hasAlerts = false,
}: {
  user: AppUser
  hasAlerts?: boolean
}) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

      <div className="relative max-w-xs flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search…"
          className="h-10 rounded-full border-border bg-muted pl-9 text-sm shadow-none focus-visible:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative size-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
          <Bell className="size-5" />
          {hasAlerts ? (
            <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
          ) : null}
          <span className="sr-only">Notifications</span>
        </Button>
        <NavUser user={user} />
      </div>
    </header>
  )
}
