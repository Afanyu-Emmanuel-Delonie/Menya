import apiEndpointsJson from "@/mock/api-endpoints.json"
import apiKeysJson from "@/mock/api-keys.json"
import apiUsageJson from "@/mock/api-usage.json"
import dataFeedsJson from "@/mock/data-feeds.json"
import { getInstitutionById } from "@/lib/data/institutions"
import type {
  ApiEndpointDoc,
  ApiKey,
  ApiUsageSummary,
  DataFeedRun,
  NewApiKeyInput,
  NewApiKeyResult,
} from "@/types/data-apis"

const dataFeeds: DataFeedRun[] = dataFeedsJson as DataFeedRun[]
const apiKeys: ApiKey[] = apiKeysJson as ApiKey[]
const apiUsage = apiUsageJson as ApiUsageSummary
const apiEndpoints: ApiEndpointDoc[] = apiEndpointsJson as ApiEndpointDoc[]

export async function getDataFeeds(): Promise<DataFeedRun[]> {
  return dataFeeds
}

export async function getDataFeedById(id: string): Promise<DataFeedRun | undefined> {
  return dataFeeds.find((feed) => feed.id === id)
}

export async function retryDataFeed(id: string): Promise<DataFeedRun> {
  const feed = dataFeeds.find((f) => f.id === id)
  if (!feed) throw new Error("Feed run not found")
  feed.status = "success"
  feed.completedAt = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  feed.errorMessage = null
  return feed
}

export async function getApiKeys(): Promise<ApiKey[]> {
  return apiKeys
}

let nextKeyId = apiKeys.length + 1

export async function createApiKey(input: NewApiKeyInput): Promise<NewApiKeyResult> {
  const institution = await getInstitutionById(input.institutionId)
  if (!institution) throw new Error("Institution not found")

  const last4 = Math.random().toString(16).slice(2, 6)
  const prefix = input.environment === "live" ? "mnya_live_" : "mnya_test_"
  const key: ApiKey = {
    id: `key-${nextKeyId++}`,
    institutionId: input.institutionId,
    institutionName: institution.name,
    label: input.label,
    prefix,
    last4,
    environment: input.environment,
    createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    lastUsedAt: null,
    status: "active",
  }
  apiKeys.unshift(key)
  return { key, fullKey: `${prefix}${Array.from({ length: 24 }, () => Math.random().toString(36)[2] ?? "0").join("")}${last4}` }
}

export async function revokeApiKey(id: string): Promise<ApiKey> {
  const key = apiKeys.find((k) => k.id === id)
  if (!key) throw new Error("API key not found")
  key.status = "revoked"
  return key
}

export async function getApiUsage(rangeDays: 7 | 30 | 90): Promise<ApiUsageSummary> {
  return {
    ...apiUsage,
    days: apiUsage.days.slice(-rangeDays),
  }
}

export async function getApiEndpoints(): Promise<ApiEndpointDoc[]> {
  return apiEndpoints
}
