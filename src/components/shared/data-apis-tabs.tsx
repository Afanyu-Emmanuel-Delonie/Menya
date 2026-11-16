"use client"

import type { ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const validTabs = ["overview", "feeds", "keys", "usage", "endpoints"] as const
type TabValue = (typeof validTabs)[number]

export function DataApisTabs({
  overview,
  feeds,
  keys,
  usage,
  endpoints,
}: Record<TabValue, ReactNode>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const activeTab: TabValue = (validTabs as readonly string[]).includes(tabParam ?? "")
    ? (tabParam as TabValue)
    : "overview"

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="feeds">Data feeds</TabsTrigger>
        <TabsTrigger value="keys">API keys</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4">
        {overview}
      </TabsContent>
      <TabsContent value="feeds" className="pt-4">
        {feeds}
      </TabsContent>
      <TabsContent value="keys" className="pt-4">
        {keys}
      </TabsContent>
      <TabsContent value="usage" className="pt-4">
        {usage}
      </TabsContent>
      <TabsContent value="endpoints" className="pt-4">
        {endpoints}
      </TabsContent>
    </Tabs>
  )
}
