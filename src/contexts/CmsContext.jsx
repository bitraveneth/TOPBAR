/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useMemo, useState } from 'react'
import { getDefaultCmsMap } from '../lib/cmsDefaults'
import { CmsContext } from './cmsSharedContext'

function mergeCms(defaults, overrides) {
  const merged = { ...defaults }
  for (const [key, value] of Object.entries(overrides || {})) {
    if (value && typeof value === 'object') merged[key] = value
  }
  return merged
}

export function CmsProvider({ children }) {
  const defaults = useMemo(() => getDefaultCmsMap(), [])
  const [overrides, setOverrides] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/cms')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setOverrides(data.documents || {})
      })
      .catch(() => {
        if (!cancelled) setOverrides({})
      })
    return () => { cancelled = true }
  }, [])

  const value = useMemo(
    () => ({
      loading: overrides === null,
      merged: mergeCms(defaults, overrides),
      refresh: () => {},
    }),
    [defaults, overrides],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}
