import Link from "next/link"

import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { ModelsTable } from "@/components/tables/models-table"
import { getModels } from "@/lib/data/models"

export default async function AdminModelsPage() {
  const models = await getModels()
  const shadowModels = models.filter((m) => m.status === "shadow")
  const driftingModel = models.find((m) => m.drift === "drifting")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Models</h1>
        <p className="text-sm text-muted-foreground">
          How Menya&apos;s scoring models perform, drift and treat people fairly
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Live models"
          value={String(models.length)}
          caption={`${shadowModels.length} in shadow mode`}
        />
        <StatCard
          label="Average accuracy"
          value="AUC 0.82"
          delta={{ value: "0.01", direction: "up", tone: "positive" }}
          caption="vs last month"
        />
        <StatCard
          label="Drift status"
          value={driftingModel ? "1 drifting" : "All stable"}
          footer={
            driftingModel ? (
              <Link href={`/admin/models/${driftingModel.id}`} className="w-fit">
                <StatusBadge label={driftingModel.name} tone="warning" />
              </Link>
            ) : undefined
          }
        />
        <StatCard label="Fairness checks" value="11/12" caption="passed this month" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <ModelsTable data={models} />
      </div>
    </div>
  )
}
