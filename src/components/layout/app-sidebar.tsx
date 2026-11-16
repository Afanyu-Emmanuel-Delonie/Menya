"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { AppUser } from "@/components/layout/nav-user"
import type { NavGroup } from "@/components/layout/nav-items"

export function AppSidebar({
  navGroups,
  user,
  homeUrl = "/",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navGroups: NavGroup[]
  user: AppUser
  homeUrl?: string
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" style={{ "--sidebar": "#042726", "--sidebar-foreground": "#ffffff", "--sidebar-accent": "#0b4241", "--sidebar-accent-foreground": "#ffffff", "--sidebar-border": "#0b4241" } as React.CSSProperties} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href={homeUrl} />} className="hover:bg-transparent active:bg-transparent">
              <div className="flex size-7 items-end justify-baseline">
                <Image src="/logo/logo-mark.svg" alt="Menya" width={28} height={30} />
              </div>
              <span className="font-heading text-2xl font-semibold text-white self-end">
                menya
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navGroups.flatMap((group) => group.items).map((item) => {
                const isActive =
                  pathname === item.url || pathname?.startsWith(`${item.url}/`)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      render={<Link href={item.url} />}
                      className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/15 data-[active=true]:text-white py-5 px-3"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 py-5 px-3"
            >
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
