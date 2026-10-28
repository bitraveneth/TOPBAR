/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, CircleDashed, KeyRound, Plus, ScanLine, Search, ShieldCheck, Upload } from 'lucide-react'
import { adminFetch } from '../lib/adminApi'
import { formatCount, formatWhen } from '../lib/verifyFormat'
import CodeDrawer from './CodeDrawer'
import Pager from './Pager'
import StatusMark from './StatusMark'

const emptyForm = { code: '', serial: '', batchLabel: '', notes: '', expiresAt: '' }

export default function CodesPage() {
  const navigate = useNavigate()
  const timer = useRef(null)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [revision, setRevision] = useState(0)
  const [openId, setOpenId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [createError, setCreateError] = useState('')
  const [saving, setSaving] = useState(false)
  const [snapshot, setSnapshot] = useState({ key: '', data: null, error: '' })
  const key = `${query}|${page}|${revision}`
  const current = snapshot.key === key
  const data = current ? snapshot.data : snapshot.data
  const error = current ? snapshot.error : ''

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ page: String(page), pageSize: '25', q: query })
    adminFetch(`/api/admin/codes?${params}`)
      .then((next) => { if (!cancelled) setSnapshot({ key, data: next, error: '' }) })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else setSnapshot({ key, data: null, error: err.message })
      })
    return () => { cancelled = true }
  }, [key, navigate, page, query])

  function onSearch(value) {
    setDraft(value)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setQuery(value.trim())
      setPage(1)
    }, 250)
  }

  function setField(name, value) {
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  async function createCode(event) {
    event.preventDefault()
    setSaving(true)
    setCreateError('')
    try {
      await adminFetch('/api/admin/codes', {
        method: 'POST',
        body: JSON.stringify({
          code: form.code,
          serial: form.serial,
          batchLabel: form.batchLabel,
          notes: form.notes,
          expiresAt: form.expiresAt || null,
        }),
      })
      setForm(emptyForm)
      setCreating(false)
      setRevision((value) => value + 1)
    } catch (err) {
      if (err.status === 401) navigate('/admin/login', { replace: true })
      else setCreateError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const stats = data?.stats
  const items = current && data ? data.items : (data?.items || [])
  const loading = !current && !error
  const statCards = [
    { label: 'Codes', value: formatCount(stats?.total), icon: KeyRound },
    { label: 'Valid', value: formatCount(stats?.valid), icon: ShieldCheck },
    { label: 'Verified', value: formatCount(stats?.verified), icon: ScanLine },
    { label: 'Never checked', value: formatCount(stats?.neverVerified), icon: CircleDashed },
  ]

  return (
    <div className="admin-page code-board">
      <header className="admin-page__head">
        <div>
          <h1>Codes</h1>
          <p>Scratch codes on the pack, and the links customers scan.</p>
        </div>
      </header>

      <section className="code-stats" aria-label="Summary">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="code-stat">
              <span className="code-stat__icon" aria-hidden="true"><Icon size={18} /></span>
              <div>
                <strong>{card.value}</strong>
                <span className="code-stat__label">{card.label}</span>
              </div>
            </article>
          )
        })}
      </section>

      {creating ? (
        <form className="code-create" onSubmit={createCode}>
          <div className="code-create__head">
            <h2>Add a code</h2>
            <p>Paste a scratch code, a serial, or a full verify link.</p>
          </div>
          <div className="code-create__grid">
            <label className="admin-field">
              <span>Code or verify link</span>
              <input value={form.code} onChange={(event) => setField('code', event.target.value)} required placeholder="ATBRGB7P" />
            </label>
            <label className="admin-field">
              <span>Serial</span>
              <input value={form.serial} onChange={(event) => setField('serial', event.target.value)} inputMode="numeric" placeholder="Optional" />
            </label>
            <label className="admin-field">
              <span>Batch</span>
              <input value={form.batchLabel} onChange={(event) => setField('batchLabel', event.target.value)} placeholder="Optional" />
            </label>
            <label className="admin-field">
              <span>Expires</span>
              <input type="datetime-local" value={form.expiresAt} onChange={(event) => setField('expiresAt', event.target.value)} />
            </label>
            <label className="admin-field admin-field--wide">
              <span>Notes</span>
              <input value={form.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Optional" />
            </label>
            {createError ? <p className="admin-error admin-field--wide">{createError}</p> : null}
            <div className="code-create__actions">
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { setCreating(false); setCreateError('') }}>Cancel</button>
              <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Add code'}</button>
            </div>
          </div>
        </form>
      ) : null}

      <section className="code-panel">
        <div className="code-toolbar">
          <label className="code-search">
            <Search size={16} aria-hidden="true" />
            <input
              value={draft}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search code, serial, or batch"
              aria-label="Search codes"
            />
          </label>
          <div className="code-toolbar__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setCreating((open) => !open)}>
              <Plus size={15} /> {creating ? 'Close' : 'New code'}
            </button>
            <Link className="admin-btn" to="/admin/codes/import"><Upload size={15} /> Import</Link>
          </div>
        </div>

        {error ? <p className="admin-error code-panel__note">{error}</p> : null}
        {loading ? <p className="admin-note code-panel__note">Loading codes…</p> : null}

        <div className="admin-table-wrap code-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Serial</th>
                <th>Batch</th>
                <th>Last result</th>
                <th>Checks</th>
                <th>Last check</th>
                <th className="code-go" aria-label="Open" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} onClick={() => setOpenId(item.id)} tabIndex={0} onKeyDown={(event) => {
                  if (event.key === 'Enter') setOpenId(item.id)
                }}>
                  <td>
                    <code className="code-chip">{item.code}</code>
                    {item.suspicious ? <em className="admin-hot">Many checks</em> : null}
                    {!item.isValid ? <em className="admin-hot admin-hot--off">Disabled</em> : null}
                  </td>
                  <td className="code-serial">{item.serial || '—'}</td>
                  <td>{item.batchLabel || '—'}</td>
                  <td><StatusMark status={item.lastStatus} /></td>
                  <td>{formatCount(item.verificationCount)}</td>
                  <td>{formatWhen(item.lastAttemptAt)}</td>
                  <td className="code-go" aria-hidden="true"><ChevronRight size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {current && data && data.total === 0 ? (
            <div className="code-empty">
              <KeyRound size={22} aria-hidden="true" />
              <strong>{query ? 'No codes match that search.' : 'No codes yet.'}</strong>
              <span>{query ? 'Try another code, serial, or batch.' : 'Import a text file, or add one code.'}</span>
            </div>
          ) : null}
        </div>

        {current && data && data.total > (data.pageSize || 25) ? (
          <div className="code-panel__foot">
            <Pager page={page} pageSize={data.pageSize || 25} total={data.total} onPage={setPage} />
          </div>
        ) : null}
      </section>

      {openId ? (
        <CodeDrawer
          codeId={openId}
          onClose={() => setOpenId(null)}
          onSaved={() => {
            setOpenId(null)
            setRevision((value) => value + 1)
          }}
        />
      ) : null}
    </div>
  )
}
