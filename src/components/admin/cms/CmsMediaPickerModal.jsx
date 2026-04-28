import { useCallback, useEffect, useState } from 'react'
import { listCmsMediaFiles } from '../../../lib/cmsAdminApi'
import { X } from 'lucide-react'

export default function CmsMediaPickerModal({ open, onClose, onSelect }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      setFiles(await listCmsMediaFiles('public'))
    } catch (e) {
      setErr(e.message || 'Could not load library')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  if (!open) return null

  return (
    <div className="admin-cms-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="admin-cms-modal" role="dialog" aria-modal="true" aria-label="Media library" onClick={(e) => e.stopPropagation()}>
        <div className="admin-cms-modal__head">
          <h2>Choose image</h2>
          <button type="button" className="admin-cms-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <p className="admin-cms-hint" style={{ marginBottom: '1rem' }}>
          Click an image to use its URL. Upload files under <strong>Media</strong> in the admin sidebar first if needed.
        </p>
        {loading ? <p className="admin-page-sub">Loading…</p> : null}
        {err ? <p className="admin-msg admin-msg--err">{err}</p> : null}
        {!loading && !err && files.length === 0 ? (
          <p className="admin-page-sub">No files yet. Open Media in the admin sidebar and upload images.</p>
        ) : null}
        <div className="admin-cms-media-grid">
          {files.map((f) => (
            <button
              key={f.path}
              type="button"
              className="admin-cms-media-tile"
              onClick={() => {
                onSelect(f.publicUrl)
                onClose()
              }}
            >
              <img src={f.publicUrl} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
