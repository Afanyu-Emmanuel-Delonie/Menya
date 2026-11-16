"use client"

import type { ReactNode } from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { adminNavGroups } from "@/components/layout/nav-items"
import type { AppUser } from "@/components/layout/nav-user"

const currentUser: AppUser = {
  name: "Gustavo Xavier",
  email: "gustavoxavier@mail.com",
  role: "Super Admin",
  initials: "GX",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar
        navGroups={adminNavGroups}
        user={currentUser}
        homeUrl="/admin/dashboard"
      />
      <SidebarInset>
        <SiteHeader user={currentUser} hasAlerts />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
