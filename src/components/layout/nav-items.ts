import {
  LayoutDashboard,
  BellRing,
  Cpu,
  Building2,
  Database,
  ShieldCheck,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon: LucideIcon
}

export type NavGroup = {
  label?: string
  items: NavItem[]
}

export const adminNavGroups: NavGroup[] = [
  {
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Models", url: "/admin/models", icon: Cpu },
      { title: "Institutions", url: "/admin/institutions", icon: Building2 },
      { title: "Data & APIs", url: "/admin/data-apis", icon: Database },
    ],
  },
  {
    label: "Oversight",
    items: [
      { title: "Alerts & Incidents", url: "/admin/alerts", icon: BellRing },
      { title: "Consent Analytics", url: "/admin/consent-analytics", icon: ShieldCheck },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: ScrollText },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
]

// legacy flat list kept for other portals
export type { NavGroup as NavItemGroup }
export const adminNavItems = adminNavGroups.flatMap((g) => g.items)
