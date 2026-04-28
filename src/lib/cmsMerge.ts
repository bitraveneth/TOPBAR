export function deepMerge<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base
  if (typeof override !== 'object') return override as T
  if (Array.isArray(override)) return override as T
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return override as T
  const out = { ...(base as Record<string, unknown>) }
  for (const key of Object.keys(override as object)) {
    const o = (override as Record<string, unknown>)[key]
    const b = (base as Record<string, unknown>)[key]
    out[key] = key in (base as object) && b !== undefined ? deepMerge(b as never, o) : o
  }
  return out as T
}

type RemoteRow = { content_key?: string; payload?: unknown }

export function mergeCmsDocuments<T extends Record<string, unknown>>(
  defaultsMap: T,
  remoteRows: RemoteRow[] | null | undefined,
): T {
  const remote: Record<string, unknown> = {}
  for (const row of remoteRows || []) {
    if (row?.content_key && row.payload !== undefined) {
      remote[row.content_key] = row.payload
    }
  }
  const out = { ...defaultsMap }
  for (const key of Object.keys(defaultsMap)) {
    out[key as keyof T] = deepMerge(defaultsMap[key as keyof T] as never, remote[key] || {}) as T[keyof T]
  }
  return out
}
