import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, FlaskConical, Settings2 } from "lucide-react"

import { AlertsPanel } from "@/components/shared/alerts-panel"
import { DriftFeaturesTable } from "@/components/shared/drift-features-table"
import { EmptyState } from "@/components/shared/empty-state"
import { FairnessTable } from "@/components/shared/fairness-table"
import { StatCard } from "@/components/shared/stat-card"
import { DriftBadge, ModelStatusBadge } from "@/components/shared/status-badge"
import { VersionHistory } from "@/components/shared/version-history"
import { DistributionChart } from "@/components/charts/distribution-chart"
import { ExplainabilityList } from "@/components/charts/explainability-list"
import { LineChart } from "@/components/charts/line-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModelAlerts, getModelById } from "@/lib/data/models"

export default async function ModelDetailPage(props: PageProps<"/admin/models/[id]">) {
  const { id } = await props.params
  const model = await getModelById(id)

  if (!model) {
    notFound()
  }

  const alerts = await getModelAlerts(id)
  const isShadow = model.status === "shadow"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/models"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Models
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{model.name}</h1>
          <ModelStatusBadge status={model.status} />
          <DriftBadge drift={model.drift} />
        </div>
        <p className="text-sm text-muted-foreground">{model.purpose}</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drift">Drift</TabsTrigger>
          <TabsTrigger value="fairness">Fairness</TabsTrigger>
          <TabsTrigger value="explainability">Explainability</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4 pt-4">
          {isShadow ? (
            <EmptyState
              icon={FlaskConical}
              title="Running in shadow mode"
              description={`${model.name} is scoring traffic in the background but isn't live yet, so there's no performance history to show.`}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <StatCard
                  label="Accuracy"
                  value={model.accuracy != null ? `AUC ${model.accuracy.toFixed(2)}` : "—"}
                />
                <StatCard
                  label="Approval rate"
                  value={`${Math.round(model.approvalRate * 100)}%`}
                />
                <StatCard
                  label="Predictions this month"
                  value={model.predictionVolume.toLocaleString()}
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-4">
                <Settings2 className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Alert threshold</span>
                  <span className="text-xs text-muted-foreground">
                    Alert when {model.alertThreshold.metric.toLowerCase()} drops{" "}
                    {model.alertThreshold.comparator} {model.alertThreshold.value}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 xl:col-span-2">
                  <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Performance over time
                  </h2>
                  <LineChart data={model.performance} />
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h2 className="mb-3 text-sm font-semibold text-foreground">Latest alerts</h2>
                  <AlertsPanel alerts={alerts} viewAllHref="/admin/alerts?tab=alerts" />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Score distribution</h2>
                <DistributionChart data={model.scoreDistribution} />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="drift" className="flex flex-col gap-4 pt-4">
          {model.driftFeatures.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title="No drift data yet"
              description="This model hasn't scored enough live traffic to compare against its training data."
            />
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-1 text-sm font-semibold text-foreground">
                  This month vs training data
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  Score distribution laid over the data the model was trained on.
                </p>
                <DistributionChart
                  data={model.currentDistribution}
                  trainingData={model.trainingDistribution}
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="mb-1 text-sm font-semibold text-foreground">What changed</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  Input features that moved the most since training.
                </p>
                <DriftFeaturesTable features={model.driftFeatures} />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="fairness" className="flex flex-col gap-4 pt-4">
          {model.fairness.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title="No fairness data yet"
              description="Fairness checks run once this model is scoring consented member data."
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-1 text-sm font-semibold text-foreground">
                Approval rate and average score by group
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                Every group is checked against the platform-wide average so no segment is
                quietly left behind.
              </p>
              <FairnessTable rows={model.fairness} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="explainability" className="flex flex-col gap-4 pt-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-1 text-sm font-semibold text-foreground">What drives this score</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Ranked by how much each factor moves the final score, in plain language.
            </p>
            <ExplainabilityList factors={model.explainability} />
          </div>
        </TabsContent>

        <TabsContent value="versions" className="flex flex-col gap-4 pt-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-1 text-sm font-semibold text-foreground">Version history</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Promote a version to send it live, or roll back to a version that was live before.
            </p>
            <VersionHistory modelId={model.id} modelName={model.name} versions={model.versions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
