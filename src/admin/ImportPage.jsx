/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../lib/adminApi'
import { formatCount, formatWhen } from '../lib/verifyFormat'
import MetricStrip from './MetricStrip'

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsText(file)
  })
}

export default function ImportPage() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [filename, setFilename] = useState('')
  const [mode, setMode] = useState('skip')
  const [batchLabel, setBatchLabel] = useState('')
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [previewText, setPreviewText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [imports, setImports] = useState([])
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let cancelled = false
    adminFetch('/api/admin/imports')
      .then((data) => { if (!cancelled) setImports(data.items || []) })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) navigate('/admin/login', { replace: true })
      })
    return () => { cancelled = true }
  }, [navigate, revision])

  async function takeFile(file) {
    if (!file) return
    setError('')
    setNotice('')
    setPreview(null)
    try {
      const contents = await readFile(file)
      setText(contents)
      setFilename(file.name)
    } catch (err) {
      setError(err.message)
    }
  }

  async function runPreview() {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const summary = await adminFetch('/api/admin/imports/preview', {
        method: 'POST',
        body: JSON.stringify({ text, filename }),
      })
      setPreview(summary)
      setPreviewText(text)
    } catch (err) {
      if (err.status === 401) navigate('/admin/login', { replace: true })
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function runImport() {
    setBusy(true)
    setError('')
    try {
      const record = await adminFetch('/api/admin/imports', {
        method: 'POST',
        body: JSON.stringify({ text, filename, mode, batchLabel }),
      })
      setNotice(`Imported ${formatCount(record.inserted)} new codes${record.updated ? `, refreshed ${formatCount(record.updated)}` : ''}.`)
      setPreview(null)
      setPreviewText('')
      setText('')
      setFilename('')
      setRevision((value) => value + 1)
    } catch (err) {
      if (err.status === 401) navigate('/admin/login', { replace: true })
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const previewReady = preview && previewText === text

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="admin-kicker">Desk</p>
          <h1>Import</h1>
          <p>Upload the text file of verify links. Nothing is written until you confirm the preview.</p>
        </div>
      </header>

      <div
        className={dragging ? 'admin-drop is-dragging' : 'admin-drop'}
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          takeFile(event.dataTransfer.files?.[0])
        }}
      >
        <p>Drop a .txt or .csv file, or browse.</p>
        <label className="admin-btn">
          Browse
          <input
            type="file"
            accept=".txt,.csv,text/plain,text/csv"
            hidden
            onChange={(event) => takeFile(event.target.files?.[0])}
          />
        </label>
        <pre>{`https://example.com/verify-products?t=517500000018-ATBRGB7P
517500000018-ATBRGB7P
ATBRGB7P
517500000018,ATBRGB7P`}</pre>
        {filename ? <p className="admin-note">{filename} · {formatCount(text.length)} characters</p> : null}
      </div>

      <div className="admin-import-options">
        <fieldset>
          <legend>When a code already exists</legend>
          <label>
            <input type="radio" name="mode" value="skip" checked={mode === 'skip'} onChange={() => setMode('skip')} />
            <span>Skip it. Check counts stay untouched.</span>
          </label>
          <label>
            <input type="radio" name="mode" value="update" checked={mode === 'update'} onChange={() => setMode('update')} />
            <span>Refresh serial, token, and batch only. Check counts stay untouched.</span>
          </label>
        </fieldset>
        <label className="admin-field">
          <span>Batch label</span>
          <input value={batchLabel} onChange={(event) => setBatchLabel(event.target.value)} placeholder="June allocation" maxLength={80} />
        </label>
        <button type="button" className="admin-btn" disabled={busy || !text.trim()} onClick={runPreview}>
          {busy ? 'Working…' : 'Preview'}
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      {previewReady ? (
        <section className="admin-preview">
          <MetricStrip items={[
            { label: 'New', value: formatCount(preview.newCodes) },
            { label: 'Already here', value: formatCount(preview.existing) },
            { label: 'Unreadable', value: formatCount(preview.invalid) },
            { label: 'Duplicates in file', value: formatCount(preview.duplicatesInFile) },
          ]} />
          {preview.errors?.length ? (
            <ul className="admin-errors">
              {preview.errors.map((item) => (
                <li key={`${item.line}-${item.value}`}>Line {item.line}: {item.reason} ({item.value})</li>
              ))}
            </ul>
          ) : null}
          <button type="button" className="admin-btn" disabled={busy} onClick={runImport}>
            {mode === 'update'
              ? `Import ${formatCount(preview.newCodes)} and refresh ${formatCount(preview.existing)}`
              : `Import ${formatCount(preview.newCodes)} codes`}
          </button>
        </section>
      ) : null}

      <section className="admin-history">
        <h2>Recent imports</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Mode</th>
                <th>New</th>
                <th>Refreshed</th>
                <th>Skipped</th>
                <th>Bad rows</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((item) => (
                <tr key={item.id}>
                  <td>{item.filename}</td>
                  <td>{item.mode === 'update' ? 'Refresh' : 'Skip'}</td>
                  <td>{formatCount(item.inserted)}</td>
                  <td>{formatCount(item.updated)}</td>
                  <td>{formatCount(item.skipped)}</td>
                  <td>{formatCount(item.invalid)}</td>
                  <td>{formatWhen(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!imports.length ? <p className="admin-empty">No imports yet.</p> : null}
        </div>
      </section>
    </div>
  )
}
