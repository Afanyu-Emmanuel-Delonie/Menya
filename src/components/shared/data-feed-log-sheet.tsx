"use client"

import { FeedSourceTag, FeedStatusBadge } from "@/components/shared/data-apis-badges"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { durationBetween } from "@/lib/format"
import type { DataFeedRun } from "@/types/data-apis"

export function DataFeedLogSheet({
  feed,
  open,
  onOpenChange,
}: {
  feed: DataFeedRun | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {feed ? (
          <>
            <SheetHeader>
              <SheetTitle>{feed.institutionName}</SheetTitle>
              <SheetDescription>Upload run log</SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Source</span>
                <FeedSourceTag source={feed.source} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <FeedStatusBadge status={feed.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Scheduled</span>
                <span className="font-mono text-xs">{feed.scheduledAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-mono text-xs">{feed.completedAt ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-mono text-xs">
                  {durationBetween(feed.scheduledAt, feed.completedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Records</span>
                <span className="font-mono tabular-nums">{feed.records.toLocaleString()}</span>
              </div>
              {feed.errorMessage ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <p className="text-xs font-medium text-destructive">Error</p>
                  <p className="mt-1 text-xs text-muted-foreground">{feed.errorMessage}</p>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
