/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getDefaultCmsMap } from '../lib/cmsDefaults'

const CmsContext = createContext(null)

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

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) {
    throw new Error('useCms must be used under CmsProvider')
  }
  return ctx
}
