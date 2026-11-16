const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function parseFeedTimestamp(value: string) {
  const [datePart, timePart] = value.split(", ")
  const [day, mon, year] = datePart.split(" ")
  const [hh, mm] = timePart.split(":").map(Number)
  return new Date(Number(year), MONTHS.indexOf(mon), Number(day), hh, mm).getTime()
}

export function durationBetween(start: string, end: string | null): string {
  if (!end) return "—"
  return formatDurationMs(parseFeedTimestamp(end) - parseFeedTimestamp(start))
}

export function durationSince(start: string, end: string | null, now: Date): string {
  const endMs = end ? parseFeedTimestamp(end) : now.getTime()
  return formatDurationMs(endMs - parseFeedTimestamp(start))
}

function formatDurationMs(ms: number): string {
  const diffMin = Math.round(ms / 60000)
  if (diffMin < 60) return `${diffMin}m`
  const hours = Math.floor(diffMin / 60)
  if (hours < 24) return `${hours}h ${diffMin % 60}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}
