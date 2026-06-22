/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useMemo } from 'react'
import { getDefaultCmsMap } from '../lib/cmsDefaults'
import { CmsContext } from './cmsSharedContext'

export function CmsProvider({ children }) {
  const defaults = useMemo(() => getDefaultCmsMap(), [])
  const value = useMemo(
    () => ({
      loading: false,
      merged: defaults,
      refresh: () => {},
    }),
    [defaults],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}
