import { supabase } from './supabaseClient'
import { CMS_DOCUMENT_KEYS, getDefaultCmsMap } from './cmsDefaults'
import { deepMerge } from './cmsMerge'

export function getDocumentLabel(contentKey) {
  return CMS_DOCUMENT_KEYS.find((x) => x.key === contentKey)?.label || contentKey
}

export async function loadCmsPayload(contentKey) {
  const defaults = getDefaultCmsMap()
  const base = defaults[contentKey]
  if (!supabase) return structuredClone(base)
  const { data, error } = await supabase.from('cms_documents').select('payload').eq('content_key', contentKey).maybeSingle()
  if (error) throw error
  return deepMerge(base, data?.payload || {})
}

const REVISIONS_KEEP = 30

async function pruneRevisions(contentKey) {
  const { data: rows, error } = await supabase
    .from('cms_document_revisions')
    .select('id')
    .eq('content_key', contentKey)
    .order('created_at', { ascending: false })
  if (error || !rows?.length || rows.length <= REVISIONS_KEEP) return
  const drop = rows.slice(REVISIONS_KEEP).map((r) => r.id)
  if (!drop.length) return
  await supabase.from('cms_document_revisions').delete().in('id', drop)
}

async function archiveCurrentDocument(contentKey) {
  const { data: existing, error } = await supabase
    .from('cms_documents')
    .select('payload')
    .eq('content_key', contentKey)
    .maybeSingle()
  if (error) throw error
  if (!existing || existing.payload == null) return
  const { error: insErr } = await supabase.from('cms_document_revisions').insert({
    content_key: contentKey,
    payload: existing.payload,
  })
  if (insErr) throw insErr
  await pruneRevisions(contentKey)
}

export async function saveCmsPayload(contentKey, payload) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const label = getDocumentLabel(contentKey)
  await archiveCurrentDocument(contentKey)
  const { error } = await supabase.from('cms_documents').upsert(
    {
      content_key: contentKey,
      label,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'content_key' },
  )
  if (error) throw error
  window.dispatchEvent(new Event('cms:refresh'))
}

export async function listCmsRevisions(contentKey, limit = 40) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('cms_document_revisions')
    .select('id, created_at')
    .eq('content_key', contentKey)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getCmsRevisionPayload(revisionId) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase
    .from('cms_document_revisions')
    .select('content_key, payload')
    .eq('id', revisionId)
    .single()
  if (error) throw error
  return data
}

export async function restoreCmsRevision(revisionId) {
  const { content_key: contentKey, payload } = await getCmsRevisionPayload(revisionId)
  await saveCmsPayload(contentKey, payload)
}

export async function listCmsMediaFiles(folder = 'public', limit = 200) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.storage.from('cms').list(folder, {
    limit,
    sortBy: { column: 'created_at', order: 'desc' },
  })
  if (error) throw error
  const prefix = folder ? `${folder}/` : ''
  return (data || [])
    .filter((f) => f.name && !f.name.endsWith('/'))
    .map((f) => {
      const path = `${prefix}${f.name}`.replace(/^\//, '')
      const {
        data: { publicUrl },
      } = supabase.storage.from('cms').getPublicUrl(path)
      return {
        name: f.name,
        path,
        publicUrl,
        created_at: f.created_at,
      }
    })
}

export async function deleteCmsMediaFile(pathInBucket) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.storage.from('cms').remove([pathInBucket])
  if (error) throw error
}

export async function uploadCmsAsset(file) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const path = `public/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, '_')}`
  const { error: upErr } = await supabase.storage.from('cms').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (upErr) throw upErr
  const {
    data: { publicUrl },
  } = supabase.storage.from('cms').getPublicUrl(path)
  return publicUrl
}
