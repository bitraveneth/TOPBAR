export function deepMerge(base, override) {
  if (override === null || override === undefined) return base
  if (typeof override !== 'object') return override
  if (Array.isArray(override)) return override
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return override
  const out = { ...base }
  for (const key of Object.keys(override)) {
    const o = override[key]
    const b = base[key]
    out[key] = key in base && b !== undefined ? deepMerge(b, o) : o
  }
  return out
}

export function mergeCmsDocuments(defaultsMap, remoteRows) {
  const remote = {}
  for (const row of remoteRows || []) {
    if (row?.content_key && row.payload !== undefined) {
      remote[row.content_key] = row.payload
    }
  }
  const out = {}
  for (const key of Object.keys(defaultsMap)) {
    out[key] = deepMerge(defaultsMap[key], remote[key] || {})
  }
  return out
}
