/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../lib/adminApi'
import { mediaSizeError } from '../lib/mediaLimits'

function formatBytes(size) {
  if (!size) return ''
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaAdmin() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  function load() {
    return adminFetch('/api/admin/media')
      .then((data) => setItems(data.items))
      .catch((err) => {
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else setError(err.message)
      })
  }

  useEffect(() => {
    let cancelled = false
    adminFetch('/api/admin/media')
      .then((data) => { if (!cancelled) setItems(data.items) })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else setError(err.message)
      })
    return () => { cancelled = true }
  }, [navigate])

  async function upload(file) {
    const problem = mediaSizeError(file)
    if (problem) {
      setError(problem)
      setNotice('')
      return
    }
    const body = new FormData()
    body.append('file', file)
    setBusy(true)
    setError('')
    try {
      await adminFetch('/api/admin/media', { method: 'POST', body })
      setNotice('File uploaded.')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${item.originalName}? Pages that still use this URL will show a missing file.`)) return
    try {
      await adminFetch(`/api/admin/media/${item.id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function copy(url) {
    try {
      await navigator.clipboard.writeText(url)
      setNotice('Link copied.')
    } catch {
      setError('Could not copy that link.')
    }
  }

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Media</h1>
          <p>Images must be under 1 MB. Videos must be under 20 MB. Documents must be under 10 MB. Larger files make the public site slow.</p>
        </div>
        <label className="admin-btn">
          {busy ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            hidden
            accept="image/*,video/mp4,video/webm,video/quicktime,.pdf,.zip,.txt"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) upload(file)
              event.target.value = ''
            }}
          />
        </label>
      </header>
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}
      <div className="media-grid">
        {(items || []).map((item) => (
          <article key={item.id} className="media-tile">
            {item.kind === 'image' ? <img src={item.url} alt="" /> : null}
            {item.kind === 'video' ? <video src={item.url} controls preload="metadata" /> : null}
            {item.kind === 'document' ? <span className="media-tile__doc">{item.mime.includes('pdf') ? 'PDF' : 'File'}</span> : null}
            <strong>{item.originalName}</strong>
            <span>{formatBytes(item.size)}</span>
            <div className="media-tile__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => copy(item.url)}>Copy link</button>
              <button type="button" className="admin-btn admin-btn--danger" onClick={() => remove(item)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
      {items && items.length === 0 ? <p className="admin-note">No uploads yet.</p> : null}
    </div>
  )
}
