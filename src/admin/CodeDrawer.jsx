/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '../lib/adminApi'
import { formatWhen, toLocalInput } from '../lib/verifyFormat'
import StatusMark from './StatusMark'

function CodeForm({ detail, onSaved }) {
  const [isValid, setIsValid] = useState(detail.isValid)
  const [batchLabel, setBatchLabel] = useState(detail.batchLabel || '')
  const [notes, setNotes] = useState(detail.notes || '')
  const [expiresAt, setExpiresAt] = useState(toLocalInput(detail.expiresAt))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/verify-products?t=${encodeURIComponent(detail.token || detail.code)}`

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminFetch(`/api/admin/codes/${detail.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          isValid,
          batchLabel,
          notes,
          expiresAt: expiresAt || null,
        }),
      })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <div className="code-record__main">
      <dl className="admin-facts">
        <div><dt>Serial</dt><dd>{detail.serial || '—'}</dd></div>
        <div><dt>Checks</dt><dd>{detail.verificationCount}</dd></div>
        <div><dt>Attempts</dt><dd>{detail.attemptCount}</dd></div>
        <div><dt>Networks</dt><dd>{detail.distinctIps}</dd></div>
        <div><dt>First verified</dt><dd>{formatWhen(detail.firstVerifiedAt)}</dd></div>
        <div><dt>Batch</dt><dd>{detail.batchLabel || '—'}</dd></div>
      </dl>

      {detail.suspicious ? (
        <p className="admin-flag">Checked many times or from several networks. Treat repeats as suspicious.</p>
      ) : null}

      <label className="admin-field">
        <span>Verify link</span>
        <div className="admin-copy">
          <input readOnly value={link} title={link} />
          <button type="button" className="admin-btn admin-btn--ghost" onClick={copyLink}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </label>

      <form className="admin-form" onSubmit={save}>
        <label className="admin-check">
          <input type="checkbox" checked={isValid} onChange={(event) => setIsValid(event.target.checked)} />
          <span>Code accepts checks</span>
        </label>
        <label className="admin-field">
          <span>Batch</span>
          <input value={batchLabel} onChange={(event) => setBatchLabel(event.target.value)} maxLength={80} />
        </label>
        <label className="admin-field">
          <span>Expires</span>
          <input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
        </label>
        <label className="admin-field">
          <span>Notes</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={2000} />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </form>
      </div>

      <div className="code-record__history">
        <h3>Check history</h3>
        {detail.attempts?.length ? (
          <ol className="admin-timeline">
            {detail.attempts.map((attempt) => (
              <li key={attempt.id}>
                <StatusMark status={attempt.status} />
                <time dateTime={attempt.createdAt}>{formatWhen(attempt.createdAt)}</time>
                <code>{attempt.input}</code>
              </li>
            ))}
          </ol>
        ) : <p>No checks yet.</p>}
      </div>
    </>
  )
}

export function CodeRecord({ codeId, onSaved, onReady }) {
  const [panel, setPanel] = useState({ id: '', detail: null, error: '' })

  useEffect(() => {
    if (!codeId) return undefined
    let cancelled = false
    adminFetch(`/api/admin/codes/${codeId}`)
      .then((detail) => {
        if (cancelled) return
        setPanel({ id: codeId, detail, error: '' })
        onReady?.(detail.code)
      })
      .catch((error) => { if (!cancelled) setPanel({ id: codeId, detail: null, error: error.message }) })
    return () => { cancelled = true }
  }, [codeId, onReady])

  if (panel.id !== codeId) return <p className="admin-note">Opening this code…</p>
  if (panel.error) return <p className="admin-error">{panel.error}</p>
  return (
    <div className="code-record">
      <CodeForm detail={panel.detail} onSaved={onSaved} />
    </div>
  )
}

export default function CodeDrawer({ codeId, orphan, onClose, onSaved }) {
  const [title, setTitle] = useState({ id: codeId, text: '' })
  const heading = title.id === codeId ? title.text : ''
  const onReady = useCallback((next) => {
    setTitle({ id: codeId, text: next })
  }, [codeId])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="admin-drawer-root">
      <button type="button" className="admin-drawer-backdrop" aria-label="Close details" onClick={onClose} />
      <aside className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="code-drawer-title">
        <header className="admin-drawer__head">
          <div>
            <p className="admin-kicker">Security code</p>
            <h2 id="code-drawer-title">{heading || orphan?.input || 'Details'}</h2>
          </div>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Close</button>
        </header>

        {codeId ? <CodeRecord codeId={codeId} onSaved={onSaved} onReady={onReady} /> : null}
        {!codeId && orphan ? (
          <div>
            <StatusMark status={orphan.status} />
            <p className="admin-flag">No saved code matched this check.</p>
            <p>{formatWhen(orphan.createdAt)}</p>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
