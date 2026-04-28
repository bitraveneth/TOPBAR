import { useState } from 'react'
import { uploadCmsAsset } from '../../../lib/cmsAdminApi'
import CmsMediaPickerModal from './CmsMediaPickerModal'

export default function CmsImageField({ label, value, onChange, hint }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [libraryOpen, setLibraryOpen] = useState(false)

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr('')
    setBusy(true)
    try {
      const url = await uploadCmsAsset(file)
      onChange(url)
    } catch (e2) {
      setErr(e2.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-field admin-field--full">
      <label>{label}</label>
      <div className="admin-cms-image-row">
        <input type="url" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        <label className="admin-cms-upload-pill">
          <input type="file" accept="image/*" onChange={onFile} disabled={busy} hidden />
          {busy ? 'Uploading…' : 'Upload'}
        </label>
        <button type="button" className="admin-cms-upload-pill" onClick={() => setLibraryOpen(true)}>
          Library
        </button>
      </div>
      <CmsMediaPickerModal open={libraryOpen} onClose={() => setLibraryOpen(false)} onSelect={onChange} />
      {hint ? <p className="admin-cms-hint">{hint}</p> : null}
      {err ? <p className="admin-msg admin-msg--err">{err}</p> : null}
      {value ? (
        <div className="admin-cms-thumb-wrap">
          <img src={value} alt="" className="admin-cms-thumb" />
        </div>
      ) : null}
    </div>
  )
}
