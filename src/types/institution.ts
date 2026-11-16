export type InstitutionType = "bank" | "sacco" | "savings_group" | "inclusion_partner"
export type InstitutionStatus = "active" | "pending" | "suspended"
export type ApiHealthStatus = "healthy" | "degraded" | "down"

export type Institution = {
  id: string
  name: string
  type: InstitutionType
  district: string
  status: InstitutionStatus
  membersScored: number
  consentRate: number
  lastUpload: string
  apiStatus: ApiHealthStatus
  joinedAt: string
  contactName: string
  contactEmail: string
}

export type UploadRecord = {
  date: string
  records: number
  status: "success" | "failed" | "processing"
  duration: string
}

export type ConsentMonth = {
  label: string
  granted: number
  declined: number
  withdrawn: number
}

export type ActivityEvent = {
  id: string
  label: string
  detail: string
  time: string
}

export type InstitutionDetail = Institution & {
  loansProposed: number
  avgInclusionScore: number
  membersScoredHistory: { label: string; value: number }[]
  consentHistory: ConsentMonth[]
  uploads: UploadRecord[]
  apiKeyMasked: string
  apiRequestsThisMonth: number
  apiErrorRate: number
  activity: ActivityEvent[]
}

export type NewInstitutionInput = {
  name: string
  type: InstitutionType
  district: string
  contactName: string
  contactEmail: string
}
