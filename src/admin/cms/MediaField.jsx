/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import { adminFetch } from '../../lib/adminApi'
import { limitHint, mediaSizeError } from '../../lib/mediaLimits'

function isVideo(value) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(value || '')
}

export default function MediaField({ label, value, accept, onChange, onUploaded, hint }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const current = value || ''
  const note = hint === false ? '' : (hint || limitHint(accept || 'image/*'))

  async function upload(file) {
    const problem = mediaSizeError(file)
    if (problem) {
      setError(problem)
      return
    }
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
      {label ? <span>{label}</span> : null}
      <div className="media-field__row">
        {current && !isVideo(current) ? <img className="media-thumb" src={current} alt="" /> : null}
        {current && isVideo(current) ? <video className="media-thumb" src={current} muted playsInline preload="metadata" /> : null}
        {!current ? <span className="media-thumb media-thumb--empty">None</span> : null}
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
      {note ? <p className="media-field__hint">{note}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  )
}
