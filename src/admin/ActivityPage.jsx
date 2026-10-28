/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../lib/adminApi'
import { formatCount, formatWhen } from '../lib/verifyFormat'
import CodeDrawer from './CodeDrawer'
import MetricStrip from './MetricStrip'
import Pager from './Pager'
import StatusMark from './StatusMark'

const STATUSES = [
  ['', 'All results'],
  ['genuine_first', 'Genuine'],
  ['already_verified', 'Repeat check'],
  ['not_authentic', 'Not authentic'],
  ['invalid_format', 'Bad format'],
  ['disabled', 'Disabled'],
  ['expired', 'Expired'],
]

export default function ActivityPage() {
  const navigate = useNavigate()
  const timer = useRef(null)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [latest, setLatest] = useState(false)
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState(null)
  const [snapshot, setSnapshot] = useState({ key: '', data: null, error: '' })
  const key = `${query}|${status}|${latest ? 1 : 0}|${page}`
  const current = snapshot.key === key
  const data = snapshot.data

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({
      page: String(page),
      pageSize: '25',
      q: query,
      latest: latest ? '1' : '0',
    })
    if (status) params.set('status', status)
    adminFetch(`/api/admin/activity?${params}`)
      .then((next) => { if (!cancelled) setSnapshot({ key, data: next, error: '' }) })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else setSnapshot({ key, data: null, error: err.message })
      })
    return () => { cancelled = true }
  }, [key, latest, navigate, page, query, status])

  function onSearch(value) {
    setDraft(value)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setQuery(value.trim())
      setPage(1)
    }, 250)
  }

  const summary = data?.summary
  const items = current && data ? data.items : []
  const mostTried = summary?.mostTried

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Activity</h1>
          <p>Every public check, including codes that were not found.</p>
        </div>
        <div className="admin-page__actions">
          <input
            className="admin-search"
            value={draft}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Code, serial, or batch"
            aria-label="Search activity"
          />
          <select
            className="admin-search"
            value={status}
            aria-label="Filter by result"
            onChange={(event) => { setStatus(event.target.value); setPage(1) }}
          >
            {STATUSES.map(([value, label]) => <option key={value || 'all'} value={value}>{label}</option>)}
          </select>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={latest}
              onChange={(event) => { setLatest(event.target.checked); setPage(1) }}
            />
            <span>Latest per code</span>
          </label>
        </div>
      </header>

      <MetricStrip items={[
        { label: 'Checks', value: formatCount(summary?.totalChecks) },
        { label: 'Not authentic', value: formatCount(summary?.notAuthentic) },
        { label: 'IPs today', value: formatCount(summary?.uniqueIps24h) },
        {
          label: 'Most tried',
          value: mostTried ? formatCount(mostTried.attempts) : '—',
          hint: mostTried?.code || 'No checks yet',
        },
      ]} />

      {current && snapshot.error ? <p className="admin-error">{snapshot.error}</p> : null}
      {!current && !snapshot.error ? <p className="admin-note">Loading activity…</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Input</th>
              <th>Result</th>
              <th>Code checks</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                tabIndex={0}
                onClick={() => setSelection(item)}
                onKeyDown={(event) => { if (event.key === 'Enter') setSelection(item) }}
              >
                <td>
                  <code>{item.code?.code || item.input}</code>
                  {item.code?.suspicious ? <em className="admin-hot">Many checks</em> : null}
                </td>
                <td><StatusMark status={item.status} /></td>
                <td>{item.code ? formatCount(item.code.verificationCount) : '—'}</td>
                <td>{formatWhen(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {current && data && data.total === 0 ? <p className="admin-empty">No checks match this filter.</p> : null}
      </div>

      {data ? <Pager page={page} pageSize={data.pageSize || 25} total={current ? data.total : 0} onPage={setPage} /> : null}

      {selection ? (
        <CodeDrawer
          codeId={selection.code?.id || null}
          orphan={selection.code ? null : selection}
          onClose={() => setSelection(null)}
          onSaved={() => setSelection(null)}
        />
      ) : null}
    </div>
  )
}
