export type FeedSource = "core_banking" | "momo" | "sacco_ledger" | "group_records"
export type FeedStatus = "success" | "delayed" | "failed"

export type DataFeedRun = {
  id: string
  institutionId: string
  institutionName: string
  source: FeedSource
  scheduledAt: string
  completedAt: string | null
  records: number
  status: FeedStatus
  errorMessage: string | null
}

export type ApiKeyEnvironment = "live" | "sandbox"
export type ApiKeyStatus = "active" | "revoked"

export type ApiKey = {
  id: string
  institutionId: string
  institutionName: string
  label: string
  prefix: string
  last4: string
  environment: ApiKeyEnvironment
  createdAt: string
  lastUsedAt: string | null
  status: ApiKeyStatus
}

export type ApiUsageDay = {
  date: string
  requests: number
  errors: number
  p95: number
}

export type EndpointUsage = {
  path: string
  requests: number
}

export type StatusCodeUsage = {
  code: string
  count: number
}

export type InstitutionTraffic = {
  institutionId: string
  institutionName: string
  requests: number
}

export type ApiUsageSummary = {
  days: ApiUsageDay[]
  byEndpoint: EndpointUsage[]
  byStatusCode: StatusCodeUsage[]
  byInstitution: InstitutionTraffic[]
}

export type ApiEndpointDoc = {
  method: "GET" | "POST"
  path: string
  description: string
  auth: string
  exampleRequest: string
  exampleResponse: string
}

export type NewApiKeyInput = {
  institutionId: string
  label: string
  environment: ApiKeyEnvironment
}

export type NewApiKeyResult = {
  key: ApiKey
  fullKey: string
}
