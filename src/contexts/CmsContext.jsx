import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { getDefaultCmsMap } from '../lib/cmsDefaults'
import { deepMerge, mergeCmsDocuments } from '../lib/cmsMerge'
import { fetchStrapiCmsMap } from '../lib/strapiCmsApi'

const CmsContext = createContext(null)
const CMS_SOURCE = String(import.meta.env.VITE_CMS_SOURCE || 'auto').toLowerCase()
const USE_STRAPI = CMS_SOURCE === 'auto' || CMS_SOURCE === 'strapi'
const USE_SUPABASE = CMS_SOURCE === 'auto' || CMS_SOURCE === 'supabase'

async function fetchCmsRows() {
  if (!isSupabaseConfigured || !supabase) return []
  const { data, error } = await supabase.from('cms_documents').select('content_key,payload')
  if (error) {
    console.warn('CMS fetch:', error.message)
    return []
  }
  return data || []
}

export function CmsProvider({ children }) {
  const defaults = useMemo(() => getDefaultCmsMap(), [])
  const [remoteRows, setRemoteRows] = useState(null)
  const [strapiMap, setStrapiMap] = useState(null)

  const load = useCallback(async () => {
    const [rows, strapi] = await Promise.all([
      USE_SUPABASE ? fetchCmsRows() : Promise.resolve([]),
      USE_STRAPI
        ? fetchStrapiCmsMap().catch((error) => {
            console.warn('Strapi fetch:', error.message)
            return null
          })
        : Promise.resolve(null),
    ])
    setRemoteRows(rows)
    setStrapiMap(strapi)
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
    const base = strapiMap ? deepMerge(defaults, strapiMap) : defaults
    return mergeCmsDocuments(base, remoteRows)
  }, [defaults, remoteRows, strapiMap])

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
