import institutionsJson from "@/mock/institutions.json"
import type {
  ActivityEvent,
  ConsentMonth,
  Institution,
  InstitutionDetail,
  NewInstitutionInput,
  UploadRecord,
} from "@/types/institution"

const institutions: Institution[] = institutionsJson as Institution[]
const apiKeyRotations: Record<string, number> = {}

function maskedApiKey(id: string, seed: number) {
  const rotation = apiKeyRotations[id] ?? 0
  const value = (seed + rotation * 7919) % 65536
  return `mnya_live_••••${value.toString(16).padStart(4, "0")}`
}

function seedFromId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return hash
}

function buildMembersScoredHistory(base: Institution, seed: number) {
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
  const growth = base.status === "pending" ? 0 : base.membersScored
  return months.map((label, i) => ({
    label,
    value: Math.round((growth / 6) * (i + 1) * (0.85 + ((seed + i) % 10) / 50)),
  }))
}

function buildConsentHistory(base: Institution, seed: number): ConsentMonth[] {
  if (base.status === "pending") return []
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
  return months.map((label, i) => {
    const granted = 40 + ((seed + i * 7) % 60)
    const declined = 3 + ((seed + i * 3) % 8)
    const withdrawn = 1 + ((seed + i * 5) % 4)
    return { label, granted, declined, withdrawn }
  })
}

function buildUploads(base: Institution, seed: number): UploadRecord[] {
  if (base.status === "pending") return []
  const statuses: UploadRecord["status"][] = ["success", "success", "success", "failed", "success"]
  return Array.from({ length: 5 }).map((_, i) => ({
    date: `${String(10 - i).padStart(2, "0")} Nov 2026`,
    records: 200 + ((seed + i * 13) % 1800),
    status: base.apiStatus === "down" && i === 0 ? "failed" : statuses[(seed + i) % statuses.length],
    duration: `${1 + ((seed + i) % 6)}m ${((seed + i * 3) % 60)
      .toString()
      .padStart(2, "0")}s`,
  }))
}

function buildActivity(base: Institution): ActivityEvent[] {
  const events: ActivityEvent[] = [
    { id: "joined", label: "Joined Menya", detail: `Onboarded as a ${base.type.replace("_", " ")}`, time: base.joinedAt },
  ]
  if (base.status !== "pending") {
    events.push({ id: "approved", label: "Approved", detail: "Institution approved by platform admin", time: base.joinedAt })
  }
  if (base.apiStatus !== "healthy") {
    events.push({
      id: "api-issue",
      label: base.apiStatus === "down" ? "API connection lost" : "API latency degraded",
      detail: "Data uploads may be affected until this is resolved.",
      time: base.lastUpload,
    })
  }
  if (base.status === "suspended") {
    events.push({ id: "suspended", label: "Suspended", detail: "Suspended pending a compliance review.", time: base.lastUpload })
  }
  return events
}

export async function getInstitutions(): Promise<Institution[]> {
  return institutions
}

export async function getInstitutionById(id: string): Promise<InstitutionDetail | undefined> {
  const base = institutions.find((i) => i.id === id)
  if (!base) return undefined

  const seed = seedFromId(id)

  return {
    ...base,
    loansProposed: base.status === "pending" ? 0 : Math.round(base.membersScored * 0.08),
    avgInclusionScore: base.status === "pending" ? 0 : Math.round((55 + (seed % 30)) * 10) / 10,
    membersScoredHistory: buildMembersScoredHistory(base, seed),
    consentHistory: buildConsentHistory(base, seed),
    uploads: buildUploads(base, seed),
    apiKeyMasked: maskedApiKey(id, seed),
    apiRequestsThisMonth: base.status === "pending" ? 0 : 4000 + (seed % 90000),
    apiErrorRate: base.apiStatus === "healthy" ? 0.2 + (seed % 5) / 10 : base.apiStatus === "degraded" ? 3.5 + (seed % 5) / 2 : 100,
    activity: buildActivity(base),
  }
}

export async function setInstitutionStatus(id: string, status: "active" | "suspended") {
  const institution = institutions.find((i) => i.id === id)
  if (!institution) throw new Error("Institution not found")
  institution.status = status
  return institution
}

export async function rotateInstitutionApiKey(id: string) {
  const institution = institutions.find((i) => i.id === id)
  if (!institution) throw new Error("Institution not found")
  apiKeyRotations[id] = (apiKeyRotations[id] ?? 0) + 1
  return { apiKeyMasked: maskedApiKey(id, seedFromId(id)) }
}

let nextId = institutions.length + 1

export async function createInstitution(input: NewInstitutionInput): Promise<Institution> {
  const institution: Institution = {
    id: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${nextId++}`,
    name: input.name,
    type: input.type,
    district: input.district,
    status: "pending",
    membersScored: 0,
    consentRate: 0,
    lastUpload: "—",
    apiStatus: "healthy",
    joinedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    contactName: input.contactName,
    contactEmail: input.contactEmail,
  }
  institutions.unshift(institution)
  return institution
}
