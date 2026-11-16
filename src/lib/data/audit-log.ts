export type AuditLogEntry = {
  id: string
  time: string
  admin: string
  action: string
  area: string
  result: string
  resultTone: "positive" | "negative" | "neutral"
}

const auditLog: AuditLogEntry[] = []

export function appendAuditLogEntry(entry: Omit<AuditLogEntry, "id" | "time">): AuditLogEntry {
  const record: AuditLogEntry = {
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    ...entry,
  }
  auditLog.unshift(record)
  return record
}

export function getAuditLogEntries(): AuditLogEntry[] {
  return auditLog
}
