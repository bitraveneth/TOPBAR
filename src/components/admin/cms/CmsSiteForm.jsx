import { useCallback, useEffect, useState } from 'react'
import { loadCmsPayload, saveCmsPayload } from '../../../lib/cmsAdminApi'
import CmsImageField from './CmsImageField'
import CmsSaveBar from './CmsSaveBar'

export default function CmsSiteForm() {
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = useCallback(async () => {
    setLoading(true)
    setMsg({ type: '', text: '' })
    try {
      const data = await loadCmsPayload('site')
      setDraft(data)
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function onSave() {
    if (!draft) return
    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      await saveCmsPayload('site', draft)
      setMsg({ type: 'ok', text: 'Saved.' })
    } catch (e) {
      setMsg({ type: 'err', text: e.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !draft) {
    return (
      <>
        <h1 className="admin-page-title">Site</h1>
        <p className="admin-page-sub">{loading ? 'Loading…' : 'Could not load settings.'}</p>
      </>
    )
  }

  return (
    <>
      <h1 className="admin-page-title">Site</h1>
      <p className="admin-page-sub">Notice bar, logo, and accessibility text for the header.</p>
      <div className="admin-panel">
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Warning label (bold part)</label>
            <input value={draft.warningBold || ''} onChange={(e) => setDraft({ ...draft, warningBold: e.target.value })} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Warning message (after the bold text)</label>
            <textarea value={draft.warningText || ''} onChange={(e) => setDraft({ ...draft, warningText: e.target.value })} rows={2} />
          </div>
          <CmsImageField
            label="Logo image"
            value={draft.headerLogo}
            onChange={(url) => setDraft({ ...draft, headerLogo: url })}
            hint="PNG or SVG works best. Use Upload or paste a URL."
          />
          <div className="admin-field">
            <label>Logo alt text (accessibility)</label>
            <input value={draft.headerLogoAlt || ''} onChange={(e) => setDraft({ ...draft, headerLogoAlt: e.target.value })} />
          </div>
        </div>
        <CmsSaveBar onSave={onSave} saving={saving} message={msg} />
      </div>
    </>
  )
}
