/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useEffect, useState } from 'react'
import { adminFetch } from '../lib/adminApi'
import { formatWhen, placeLabel } from '../lib/verifyFormat'
import StatusMark from './StatusMark'

function CodeForm({ detail }) {
  return (
    <>
      <div className="code-record__main">
      <dl className="admin-facts">
        <div><dt>Checks</dt><dd>{detail.verificationCount}</dd></div>
        <div><dt>Attempts</dt><dd>{detail.attemptCount}</dd></div>
        <div><dt>Networks</dt><dd>{detail.distinctIps}</dd></div>
        <div><dt>First verified</dt><dd>{formatWhen(detail.firstVerifiedAt)}</dd></div>
        <div><dt>Last place</dt><dd>{detail.attempts?.[0] ? placeLabel(detail.attempts[0]) : '—'}</dd></div>
      </dl>

      {detail.suspicious ? (
        <p className="admin-flag">Checked many times or from several networks. Treat repeats as suspicious.</p>
      ) : null}
      </div>

      <div className="code-record__history">
        <h3>Check history</h3>
        {detail.attempts?.length ? (
          <ol className="admin-timeline">
            {detail.attempts.map((attempt) => (
              <li key={attempt.id}>
                <StatusMark status={attempt.status} />
                <time dateTime={attempt.createdAt}>{formatWhen(attempt.createdAt)}</time>
                <span className="check-place">{placeLabel(attempt)}</span>
                <code>{attempt.input}</code>
              </li>
            ))}
          </ol>
        ) : <p>No checks yet.</p>}
      </div>
    </>
  )
}

export function CodeRecord({ codeId, onReady }) {
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
      <CodeForm detail={panel.detail} />
    </div>
  )
}

export default function CodeDrawer({ codeId, orphan, onClose }) {
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

        {codeId ? <CodeRecord codeId={codeId} onReady={onReady} /> : null}
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
