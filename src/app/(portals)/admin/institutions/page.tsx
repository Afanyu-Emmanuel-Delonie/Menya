import { AddInstitutionSheet } from "@/components/shared/add-institution-sheet"
import { StatCard } from "@/components/shared/stat-card"
import { InstitutionsExplorer } from "@/components/tables/institutions-explorer"
import { getInstitutions } from "@/lib/data/institutions"

export default async function AdminInstitutionsPage() {
  const institutions = await getInstitutions()

  const active = institutions.filter((i) => i.status === "active")
  const pending = institutions.filter((i) => i.status === "pending")
  const membersScored = institutions.reduce((sum, i) => sum + i.membersScored, 0)
  const avgConsentRate = active.length
    ? active.reduce((sum, i) => sum + i.consentRate, 0) / active.length
    : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Institutions</h1>
          <p className="text-sm text-muted-foreground">
            Banks, SACCOs, savings groups and inclusion partners on Menya
          </p>
        </div>
        <AddInstitutionSheet />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active institutions" value={String(active.length)} />
        <StatCard
          label="Pending approval"
          value={String(pending.length)}
          caption={pending.length ? "Needs review" : "All caught up"}
        />
        <StatCard
          label="Members scored"
          value={membersScored.toLocaleString()}
          valueClassName="font-mono tabular-nums"
        />
        <StatCard label="Average consent rate" value={`${Math.round(avgConsentRate * 100)}%`} />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <InstitutionsExplorer data={institutions} />
      </div>
    </div>
  )
}
