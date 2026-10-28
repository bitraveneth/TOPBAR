/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useRef, useState } from 'react'
import { adminFetch } from '../../lib/adminApi'
import { getDefaultCmsMap } from '../../lib/cmsDefaults'

function cloneDefault(key) {
  const value = getDefaultCmsMap()[key]
  return value == null ? {} : structuredClone(value)
}

export function useDocument(key) {
  const [data, setDataState] = useState(() => cloneDefault(key))
  const [error, setError] = useState('')
  const [synced, setSynced] = useState(false)
  const [activeKey, setActiveKey] = useState(key)
  const touched = useRef({ key, dirty: false })

  if (key !== activeKey) {
    setActiveKey(key)
    setDataState(cloneDefault(key))
    setSynced(false)
    setError('')
  }

  function setData(next) {
    touched.current = { key, dirty: true }
    setDataState(next)
  }

  useEffect(() => {
    let cancelled = false
    adminFetch('/api/admin/cms')
      .then((payload) => {
        if (cancelled) return
        const saved = payload.documents?.[key]
        if (saved) {
          setDataState((current) => (
            touched.current.dirty && touched.current.key === key ? current : structuredClone(saved)
          ))
        }
        setSynced(true)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setSynced(true)
      })
    return () => { cancelled = true }
  }, [key])

  return { data, setData, error, setError, status: 'ready', synced }
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
