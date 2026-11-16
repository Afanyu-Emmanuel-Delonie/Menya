"use client"

import type { ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const validTabs = ["alerts", "incidents", "rules"] as const
type TabValue = (typeof validTabs)[number]

export function AlertsTabs({
  alerts,
  incidents,
  rules,
}: Record<TabValue, ReactNode>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const activeTab: TabValue = (validTabs as readonly string[]).includes(tabParam ?? "")
    ? (tabParam as TabValue)
    : "alerts"

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="alerts">Alerts</TabsTrigger>
        <TabsTrigger value="incidents">Incidents</TabsTrigger>
        <TabsTrigger value="rules">Rules</TabsTrigger>
      </TabsList>
      <TabsContent value="alerts" className="pt-4">
        {alerts}
      </TabsContent>
      <TabsContent value="incidents" className="pt-4">
        {incidents}
      </TabsContent>
      <TabsContent value="rules" className="pt-4">
        {rules}
      </TabsContent>
    </Tabs>
  )
}
