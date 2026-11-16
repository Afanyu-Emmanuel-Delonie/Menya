"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/shared/code-block"
import type { ApiEndpointDoc } from "@/types/data-apis"

function MethodBadge({ method }: { method: "GET" | "POST" }) {
  return (
    <Badge
      className={cn(
        "font-mono",
        method === "GET" ? "bg-info/10 text-info" : "bg-success/10 text-success"
      )}
    >
      {method}
    </Badge>
  )
}

export function EndpointCatalogue({ endpoints }: { endpoints: ApiEndpointDoc[] }) {
  const [openPath, setOpenPath] = useState<string | null>(null)

  return (
    <div className="flex flex-col divide-y divide-border">
      {endpoints.map((endpoint) => {
        const isOpen = openPath === endpoint.path
        return (
          <div key={endpoint.path} className="py-3">
            <button
              type="button"
              className="flex w-full min-w-0 items-start gap-3 text-left"
              onClick={() => setOpenPath(isOpen ? null : endpoint.path)}
            >
              {isOpen ? (
                <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
              )}
              <MethodBadge method={endpoint.method} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate font-mono text-sm text-foreground">
                  {endpoint.path}
                </span>
                <span className="text-xs text-muted-foreground">{endpoint.description}</span>
              </div>
              <span className="max-w-32 text-right text-xs text-muted-foreground">
                {endpoint.auth}
              </span>
            </button>

            {isOpen ? (
              <div className="mt-3 flex flex-col gap-3 pl-7">
                <CodeBlock label="Request" code={endpoint.exampleRequest} />
                <CodeBlock label="Response" code={endpoint.exampleResponse} />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
