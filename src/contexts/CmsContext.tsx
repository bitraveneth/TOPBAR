import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { getDefaultCmsMap, type DefaultCmsMap } from '../lib/cmsDefaults'
import { mergeCmsDocuments } from '../lib/cmsMerge'

type RemoteRow = { content_key?: string; payload?: unknown }

async function fetchCmsRows(): Promise<RemoteRow[]> {
  if (!isSupabaseConfigured || !supabase) return []
  const { data, error } = await supabase.from('cms_documents').select('content_key,payload')
  if (error) {
    console.warn('CMS fetch:', error.message)
    return []
  }
  return data || []
}

type CmsContextValue = {
  loading: boolean
  merged: DefaultCmsMap
  refresh: () => Promise<void>
}

const CmsContext = createContext<CmsContextValue | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => getDefaultCmsMap(), [])
  const [remoteRows, setRemoteRows] = useState<RemoteRow[] | null>(null)

  const load = useCallback(async () => {
    const rows = await fetchCmsRows()
    setRemoteRows(rows)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const onRefresh = () => {
      load()
    }
    window.addEventListener('cms:refresh', onRefresh)
    return () => window.removeEventListener('cms:refresh', onRefresh)
  }, [load])

  const merged = useMemo(() => {
    if (remoteRows === null) return null
    return mergeCmsDocuments(defaults as Record<string, unknown>, remoteRows) as DefaultCmsMap
  }, [defaults, remoteRows])

  const loading = remoteRows === null
  const value = useMemo(
    () => ({
      loading,
      merged: merged || defaults,
      refresh: load,
    }),
    [loading, merged, defaults, load],
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
