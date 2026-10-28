/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
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
  const [page, setPage] = useState(1)
  const [openKey, setOpenKey] = useState('')
  const [histories, setHistories] = useState({})
  const [selection, setSelection] = useState(null)
  const [snapshot, setSnapshot] = useState({ key: '', data: null, error: '' })
  const key = `${query}|${status}|${page}`
  const current = snapshot.key === key
  const data = snapshot.data

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({
      page: String(page),
      pageSize: '25',
      q: query,
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
  }, [key, navigate, page, query, status])

  function onSearch(value) {
    setDraft(value)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setQuery(value.trim())
      setPage(1)
      setOpenKey('')
    }, 250)
  }

  function toggle(item) {
    const next = openKey === item.key ? '' : item.key
    setOpenKey(next)
    if (!next || histories[item.key]) return
    const params = new URLSearchParams()
    if (item.codeId) params.set('codeId', item.codeId)
    else params.set('input', item.input)
    adminFetch(`/api/admin/activity/checks?${params}`)
      .then((payload) => {
        setHistories((currentHistories) => ({
          ...currentHistories,
          [item.key]: { items: payload.items, total: payload.total, error: '' },
        }))
      })
      .catch((err) => {
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else {
          setHistories((currentHistories) => ({
            ...currentHistories,
            [item.key]: { items: [], total: 0, error: err.message },
          }))
        }
      })
  }

  const summary = data?.summary
  const items = current && data ? data.items : []
  const mostTried = summary?.mostTried

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Activity</h1>
          <p>Codes are grouped. Open one to see every check and how many times it was scanned.</p>
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
            onChange={(event) => { setStatus(event.target.value); setPage(1); setOpenKey('') }}
          >
            {STATUSES.map(([value, label]) => <option key={value || 'all'} value={value}>{label}</option>)}
          </select>
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

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Times checked</th>
              <th>Latest result</th>
              <th>Last check</th>
              <th>First check</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const open = openKey === item.key
              const history = histories[item.key]
              const label = item.code?.code || item.input
              return (
                <Fragment key={item.key}>
                  <tr
                    tabIndex={0}
                    aria-expanded={open}
                    onClick={() => toggle(item)}
                    onKeyDown={(event) => { if (event.key === 'Enter') toggle(item) }}
                  >
                    <td>
                      <span className="activity-code">
                        <ChevronRight size={16} className={`activity-chevron${open ? ' is-open' : ''}`} aria-hidden="true" />
                        <span>
                          <code>{label}</code>
                          {item.code?.serial ? <span className="activity-serial">Serial {item.code.serial}</span> : null}
                          {!item.code ? <span className="activity-serial">No saved code</span> : null}
                        </span>
                        {item.suspicious ? <em className="admin-hot">Many checks</em> : null}
                      </span>
                    </td>
                    <td className="activity-count">{formatCount(item.checks)}</td>
                    <td><StatusMark status={item.latestStatus} /></td>
                    <td>{formatWhen(item.latestAt)}</td>
                    <td>{formatWhen(item.firstAt)}</td>
                  </tr>
                  {open ? (
                    <tr className="activity-detail">
                      <td colSpan={5}>
                        <div className="activity-detail__facts">
                          <span>{formatCount(item.checks)} check{item.checks === 1 ? '' : 's'}</span>
                          <span>{formatCount(item.distinctIps)} network{item.distinctIps === 1 ? '' : 's'}</span>
                          {item.code ? <span>{formatCount(item.code.verificationCount)} genuine</span> : null}
                          {item.code?.batchLabel ? <span>Batch {item.code.batchLabel}</span> : null}
                          {item.codeId ? (
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost"
                              onClick={(event) => {
                                event.stopPropagation()
                                setSelection(item)
                              }}
                            >
                              Code record
                            </button>
                          ) : <span>These checks never matched a saved code.</span>}
                        </div>
                        {history?.error ? <p className="admin-error">{history.error}</p> : null}
                        {history?.items?.length ? (
                          <ol className="admin-timeline">
                            {history.items.map((attempt) => (
                              <li key={attempt.id}>
                                <StatusMark status={attempt.status} />
                                <time dateTime={attempt.createdAt}>{formatWhen(attempt.createdAt)}</time>
                                <code>{attempt.input}</code>
                              </li>
                            ))}
                          </ol>
                        ) : null}
                        {history && history.total > history.items.length ? (
                          <p className="activity-serial">Showing the latest {history.items.length} of {formatCount(history.total)} checks.</p>
                        ) : null}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        {current && data && data.total === 0 ? <p className="admin-empty">No checks match this filter.</p> : null}
      </div>

      {data ? <Pager page={page} pageSize={data.pageSize || 25} total={current ? data.total : 0} onPage={setPage} /> : null}

      {selection?.codeId ? (
        <CodeDrawer
          codeId={selection.codeId}
          onClose={() => setSelection(null)}
          onSaved={() => setSelection(null)}
        />
      ) : null}
    </div>
  )
}
