"use client"

import { LogOut, Settings, UserRound, Users } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AppUser = {
  name: string
  email: string
  role?: string
  initials: string
}

const staffUsers: AppUser[] = [
  { name: "Amara Diallo", email: "amara@menya.io", role: "Admin", initials: "AD" },
  { name: "Kwame Asante", email: "kwame@menya.io", role: "Analyst", initials: "KA" },
  { name: "Fatima Nkosi", email: "fatima@menya.io", role: "Support", initials: "FN" },
]

export function NavUser({ user }: { user: AppUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center outline-none">
        <Avatar size="md">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user.initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          {user.role ? (
            <Badge variant="secondary" className="ml-auto text-[10px]">{user.role}</Badge>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3 py-2">
          <UserRound className="size-5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 py-2">
          <Settings className="size-5" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          Staff
        </DropdownMenuLabel>
        {staffUsers.map((staff) => (
          <DropdownMenuItem key={staff.email} className="gap-2 py-1.5">
            <Avatar size="sm">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">{staff.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{staff.name}</span>
              <span className="text-xs text-muted-foreground">{staff.role}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="gap-3 py-2">
          <LogOut className="size-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
