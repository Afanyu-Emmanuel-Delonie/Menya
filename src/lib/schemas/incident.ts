import { z } from "zod"

export const incidentFormSchema = z.object({
  title: z.string().min(3, "Give this incident a title"),
  severity: z.enum(["SEV1", "SEV2", "SEV3"], "Choose a severity"),
  owner: z.string().min(2, "Choose an owner"),
  affected: z.string().min(2, "List what's affected"),
  description: z.string().min(5, "Describe what's happening"),
})

export type IncidentFormValues = z.infer<typeof incidentFormSchema>
