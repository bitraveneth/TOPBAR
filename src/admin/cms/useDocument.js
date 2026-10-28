/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { adminFetch } from '../../lib/adminApi'
import { getDefaultCmsMap } from '../../lib/cmsDefaults'

export function useDocument(key) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false
    adminFetch('/api/admin/cms')
      .then((payload) => {
        if (cancelled) return
        const defaults = getDefaultCmsMap()
        setData(structuredClone(payload.documents?.[key] || defaults[key]))
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })
    return () => { cancelled = true }
  }, [key])

  return { data, setData, error, setError, status }
}

export function saveDocument(key, data) {
  return adminFetch(`/api/admin/cms/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function newId(prefix) {
  const rand = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
  return `${prefix}-${rand.slice(0, 8)}`
}
