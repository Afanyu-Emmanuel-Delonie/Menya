import { modelAlertsMock, modelsMock } from "@/mock/models"
import type { ModelDetail, ModelSummary } from "@/types/models"

export async function getModels(): Promise<ModelSummary[]> {
  return modelsMock.map(
    ({ id, name, purpose, version, status, accuracy, drift, lastTrained }) => ({
      id,
      name,
      purpose,
      version,
      status,
      accuracy,
      drift,
      lastTrained,
    })
  )
}

export async function getModelById(id: string): Promise<ModelDetail | undefined> {
  return modelsMock.find((model) => model.id === id)
}

export async function getModelAlerts(id: string) {
  return modelAlertsMock[id] ?? []
}

function compareVersions(a: string, b: string) {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number)
  const [aMajor, aMinor = 0] = parse(a)
  const [bMajor, bMinor = 0] = parse(b)
  if (aMajor !== bMajor) return aMajor - bMajor
  return aMinor - bMinor
}

export type VersionAction = "promote" | "rollback"

export async function setLiveVersion(modelId: string, version: string, action: VersionAction) {
  const model = modelsMock.find((m) => m.id === modelId)
  if (!model) {
    throw new Error("Model not found")
  }

  const target = model.versions.find((v) => v.version === version)
  if (!target) {
    throw new Error("Version not found")
  }

  const currentLive = model.versions.find((v) => v.status === "live")
  if (currentLive && action === "promote" && compareVersions(version, currentLive.version) <= 0) {
    throw new Error("Promote expects a newer version than the current live one")
  }
  if (currentLive && action === "rollback" && compareVersions(version, currentLive.version) >= 0) {
    throw new Error("Rollback expects an older version than the current live one")
  }

  model.versions = model.versions.map((v) => ({
    ...v,
    status: v.version === version ? "live" : v.status === "live" ? "retired" : v.status,
  }))
  model.version = version
  model.status = "live"
  model.accuracy = target.accuracy

  return model
}
