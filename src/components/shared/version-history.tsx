import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { VersionActionButton } from "@/components/shared/version-action-button"
import type { ModelVersion } from "@/types/models"

function compareVersions(a: string, b: string) {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number)
  const [aMajor, aMinor = 0] = parse(a)
  const [bMajor, bMinor = 0] = parse(b)
  if (aMajor !== bMajor) return aMajor - bMajor
  return aMinor - bMinor
}

const statusConfig: Record<ModelVersion["status"], { label: string; tone: StatusTone }> = {
  live: { label: "Live", tone: "positive" },
  shadow: { label: "Shadow", tone: "info" },
  retired: { label: "Retired", tone: "neutral" },
}

export function VersionHistory({
  modelId,
  modelName,
  versions,
}: {
  modelId: string
  modelName: string
  versions: ModelVersion[]
}) {
  const live = versions.find((v) => v.status === "live")

  return (
    <ul className="flex flex-col divide-y divide-border">
      {versions.map((version) => {
        const isLive = version.status === "live"
        const action =
          live && !isLive
            ? compareVersions(version.version, live.version) > 0
              ? "promote"
              : "rollback"
            : null
        const config = statusConfig[version.status]

        return (
          <li key={version.version} className="flex flex-col gap-1 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium tabular-nums">
                  {version.version}
                </span>
                <StatusBadge label={config.label} tone={config.tone} />
                <span className="font-mono text-sm text-muted-foreground tabular-nums">
                  {version.accuracy != null ? `AUC ${version.accuracy.toFixed(2)}` : "—"}
                </span>
                <span className="text-xs text-muted-foreground">{version.trainedOn}</span>
              </div>
              {action ? (
                <VersionActionButton
                  modelId={modelId}
                  modelName={modelName}
                  version={version.version}
                  action={action}
                />
              ) : isLive ? (
                <span className="text-xs text-muted-foreground">Current</span>
              ) : null}
            </div>
            {version.notes ? (
              <p className="text-xs text-muted-foreground">{version.notes}</p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
