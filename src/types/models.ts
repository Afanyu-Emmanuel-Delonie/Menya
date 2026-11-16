export type ModelStatus = "live" | "shadow" | "retired"
export type DriftState = "stable" | "drifting"
export type CheckState = "pass" | "flag"

export type ModelSummary = {
  id: string
  name: string
  purpose: string
  version: string
  status: ModelStatus
  accuracy: number | null
  drift: DriftState | null
  lastTrained: string
}

export type PerformancePoint = {
  label: string
  value: number
}

export type ScoreBucket = {
  bucket: string
  count: number
}

export type DriftFeature = {
  feature: string
  change: string
  direction: "up" | "down"
  state: DriftState
}

export type FairnessDimension =
  | "Gender"
  | "Region"
  | "Urban vs rural"
  | "Banked vs MoMo-only"

export type FairnessRow = {
  dimension: FairnessDimension
  group: string
  approvalRate: number
  avgScore: number
  state: CheckState
}

export type ExplainabilityFactor = {
  factor: string
  impact: number
  direction: "raises" | "lowers"
}

export type ModelVersion = {
  version: string
  status: ModelStatus
  accuracy: number | null
  trainedOn: string
  notes?: string
}

export type AlertThreshold = {
  metric: string
  comparator: "below" | "above"
  value: number
}

export type ModelDetail = ModelSummary & {
  approvalRate: number
  predictionVolume: number
  performance: PerformancePoint[]
  scoreDistribution: ScoreBucket[]
  currentDistribution: ScoreBucket[]
  trainingDistribution: ScoreBucket[]
  driftFeatures: DriftFeature[]
  fairness: FairnessRow[]
  explainability: ExplainabilityFactor[]
  versions: ModelVersion[]
  alertThreshold: AlertThreshold
}
