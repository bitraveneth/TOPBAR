import { useCallback, useEffect, useState } from 'react'
import { loadCmsPayload, saveCmsPayload } from '../../../lib/cmsAdminApi'
import CmsSaveBar from './CmsSaveBar'

export default function CmsNewsletterForm() {
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setDraft(await loadCmsPayload('newsletter'))
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
      await saveCmsPayload('newsletter', draft)
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
        <h1 className="admin-page-title">Newsletter</h1>
        <p className="admin-page-sub">{loading ? 'Loading…' : 'Unavailable.'}</p>
      </>
    )
  }

  return (
    <>
      <h1 className="admin-page-title">Newsletter</h1>
      <p className="admin-page-sub">Email capture block on the home page.</p>
      <div className="admin-panel">
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Heading</label>
            <input value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Email field label</label>
            <input value={draft.emailLabel || ''} onChange={(e) => setDraft({ ...draft, emailLabel: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Placeholder</label>
            <input value={draft.placeholder || ''} onChange={(e) => setDraft({ ...draft, placeholder: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Submit button</label>
            <input value={draft.buttonJoin || ''} onChange={(e) => setDraft({ ...draft, buttonJoin: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>After submit message</label>
            <input value={draft.buttonJoined || ''} onChange={(e) => setDraft({ ...draft, buttonJoined: e.target.value })} />
          </div>
        </div>
        <CmsSaveBar onSave={onSave} saving={saving} message={msg} />
      </div>
    </>
  )
}
