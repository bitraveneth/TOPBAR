/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import { adminFetch } from '../../lib/adminApi'

function isVideo(value) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(value || '')
}

export default function MediaField({ label, value, accept, onChange, onUploaded }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const current = value || ''

  async function upload(file) {
    const body = new FormData()
    body.append('file', file)
    setBusy(true)
    setError('')
    try {
      const media = await adminFetch('/api/admin/media', { method: 'POST', body })
      onChange(media.url)
      onUploaded?.(media)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="media-field">
      <span>{label}</span>
      {current && !isVideo(current) ? <img src={current} alt="" /> : null}
      {current && isVideo(current) ? <video src={current} controls preload="metadata" /> : null}
      <div className="media-field__row">
        <input value={current} onChange={(event) => onChange(event.target.value)} placeholder="Upload or paste a URL" />
        <label className="admin-btn admin-btn--ghost">
          {busy ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept={accept}
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) upload(file)
              event.target.value = ''
            }}
          />
        </label>
        {current ? <button type="button" className="admin-btn admin-btn--ghost" onClick={() => onChange('')}>Clear</button> : null}
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  )
}
