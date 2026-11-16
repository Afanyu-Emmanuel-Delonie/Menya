import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, User } from "lucide-react"
import { Building2 } from "lucide-react"

import { ActivityTimeline } from "@/components/shared/activity-timeline"
import { DataFeedsTable } from "@/components/shared/data-feeds-table"
import {
  ApiStatusBadge,
  InstitutionStatusBadge,
  InstitutionTypeTag,
} from "@/components/shared/institution-badges"
import { InstitutionStatusAction } from "@/components/shared/institution-status-action"
import { RotateApiKeyButton } from "@/components/shared/rotate-api-key-button"
import { StatCard } from "@/components/shared/stat-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ConsentChart } from "@/components/charts/consent-chart"
import { LineChart } from "@/components/charts/line-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInstitutionById } from "@/lib/data/institutions"

export default async function InstitutionDetailPage(
  props: PageProps<"/admin/institutions/[id]">
) {
  const { id } = await props.params
  const institution = await getInstitutionById(id)

  if (!institution) {
    notFound()
  }

  const isPending = institution.status === "pending"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/institutions"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Institutions
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">{institution.name}</h1>
            <InstitutionStatusBadge status={institution.status} />
          </div>
          <InstitutionStatusAction
            institutionId={institution.id}
            institutionName={institution.name}
            status={institution.status}
          />
        </div>
        <InstitutionTypeTag type={institution.type} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity & feeds</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="flex flex-col gap-4 pt-4">
          {isPending ? (
            <EmptyState
              icon={Building2}
              title="Awaiting approval"
              description={`${institution.name} hasn't uploaded any data yet. Approve it to start scoring members.`}
            />
          ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                  label="Members scored"
                  value={institution.membersScored.toLocaleString()}
                  valueClassName="font-mono tabular-nums"
                />
                <StatCard
                  label="Consent rate"
                  value={`${Math.round(institution.consentRate * 100)}%`}
                />
                <StatCard
                  label="Loans proposed"
                  value={institution.loansProposed.toLocaleString()}
                  valueClassName="font-mono tabular-nums"
                />
                <StatCard
                  label="Avg inclusion score"
                  value={institution.avgInclusionScore.toFixed(1)}
                />
              </div>

              {/* Chart + Contact + API */}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 xl:col-span-2">
                  <h2 className="mb-4 text-sm font-semibold text-foreground">
                    Members scored over time
                  </h2>
                  <LineChart data={institution.membersScoredHistory} />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Contact */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h2 className="mb-3 text-sm font-semibold text-foreground">Contact</h2>
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span>{institution.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <span className="break-all text-muted-foreground">
                          {institution.contactEmail}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>District</span>
                        <span className="text-foreground">{institution.district}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Joined</span>
                        <span className="text-foreground">{institution.joinedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* API */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <h2 className="text-sm font-semibold text-foreground">API access</h2>
                        <p className="font-mono text-xs text-muted-foreground">
                          {institution.apiKeyMasked}
                        </p>
                      </div>
                      <RotateApiKeyButton
                        institutionId={institution.id}
                        institutionName={institution.name}
                      />
                    </div>
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Requests this month</span>
                        <span className="font-mono text-foreground tabular-nums">
                          {institution.apiRequestsThisMonth.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Error rate</span>
                        <span className="font-mono text-foreground tabular-nums">
                          {institution.apiErrorRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status</span>
                        <ApiStatusBadge status={institution.apiStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="rounded-xl border border-border bg-card p-4">
                {institution.consentHistory.length === 0 ? (
                  <EmptyState
                    icon={Building2}
                    title="No consent data yet"
                    description="Consent activity appears once this institution starts uploading consented member data."
                  />
                ) : (
                  <>
                    <h2 className="mb-1 text-sm font-semibold text-foreground">
                      Consents granted, declined and withdrawn
                    </h2>
                    <p className="mb-4 text-xs text-muted-foreground">
                      Aggregate counts only — individual member consent records are never shown here.
                    </p>
                    <ConsentChart data={institution.consentHistory} />
                  </>
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* ── Activity & feeds ── */}
        <TabsContent value="activity" className="flex flex-col gap-4 pt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Activity</h2>
              <ActivityTimeline events={institution.activity} />
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-1 text-sm font-semibold text-foreground">Upload history</h2>
              <p className="mb-4 text-xs text-muted-foreground">
                Recent data uploads from this institution.
              </p>
              {institution.uploads.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No uploads yet"
                  description="Upload history will appear here once this institution sends its first data feed."
                />
              ) : (
                <DataFeedsTable uploads={institution.uploads} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
