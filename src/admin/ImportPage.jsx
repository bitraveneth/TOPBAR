/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileUp, X } from 'lucide-react'
import { adminFetch } from '../lib/adminApi'
import { formatCount, formatWhen } from '../lib/verifyFormat'
import MetricStrip from './MetricStrip'

const SAMPLE_TEXT = [
  'https://topbar.example/verify-products?t=517500000101-MINT4K2P',
  'https://topbar.example/verify-products?t=517500000102-PEACH8K1',
  'https://topbar.example/verify-products?t=517500000103-COLA9X2Q',
  'https://topbar.example/verify-products?t=517500000104-BERRY6K3',
  'https://topbar.example/verify-products?t=517500000105-GUMMY7K4',
].join('\n')

const SAMPLE_CODES = [
  { code: 'MINT4K2P', note: 'First scan should say genuine' },
  { code: 'PEACH8K1', note: 'Already checked once' },
  { code: 'COLA9X2Q', note: 'First scan should say genuine' },
  { code: 'BERRY6K3', note: 'Disabled, so the public check says not authentic' },
  { code: 'GUMMY7K4', note: 'First scan should say genuine' },
]

const FORMATS = [
  { label: 'Verify link', example: '…/verify-products?t=517500000101-MINT4K2P' },
  { label: 'Serial and code', example: '517500000101-MINT4K2P' },
  { label: 'Scratch code', example: 'MINT4K2P' },
  { label: 'CSV row', example: '517500000101,MINT4K2P' },
]

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

  function loadText(contents, name) {
    setError('')
    setNotice('')
    setPreview(null)
    setPreviewText('')
    setText(contents)
    setFilename(name)
  }

  async function takeFile(file) {
    if (!file) return
    try {
      loadText(await readFile(file), file.name)
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
      setNotice(`Saved ${formatCount(record.inserted)} new codes${record.updated ? ` and refreshed ${formatCount(record.updated)}` : ''}.`)
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
          <h1>Import</h1>
          <p>Add codes from a text file. Nothing is saved until you confirm the preview.</p>
        </div>
      </header>

      <div className="import-stage">
        <div
          className={dragging ? 'import-drop is-dragging' : 'import-drop'}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            takeFile(event.dataTransfer.files?.[0])
          }}
        >
          <div className="import-drop__icon" aria-hidden="true"><FileUp size={26} /></div>
          <h2>Drop a file here</h2>
          <p>.txt or .csv, one code per line</p>
          <label className="admin-btn">
            Choose file
            <input
              type="file"
              accept=".txt,.csv,text/plain,text/csv"
              onChange={(event) => takeFile(event.target.files?.[0])}
            />
          </label>
          {filename ? (
            <p className="import-file">
              <span>{filename}</span>
              <span>{formatCount(text.split(/\r?\n/).filter((line) => line.trim()).length)} lines</span>
              <button type="button" aria-label="Remove file" onClick={() => loadText('', '')}><X size={14} /></button>
            </p>
          ) : null}
        </div>

        <aside className="import-formats">
          <h2>What each line can look like</h2>
          <ul>
            {FORMATS.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <code>{item.example}</code>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="import-setup">
        <div className="import-modes" role="radiogroup" aria-label="When a code already exists">
          <button type="button" className={mode === 'skip' ? 'import-mode is-selected' : 'import-mode'} onClick={() => setMode('skip')}>
            <strong>Skip existing</strong>
            <span>Leave codes you already have exactly as they are, including check counts.</span>
          </button>
          <button type="button" className={mode === 'update' ? 'import-mode is-selected' : 'import-mode'} onClick={() => setMode('update')}>
            <strong>Refresh labels</strong>
            <span>Update serial, link, and batch. Check counts stay as they are.</span>
          </button>
        </div>
        <div className="import-actions">
          <label className="admin-field">
            <span>Batch label</span>
            <input value={batchLabel} onChange={(event) => setBatchLabel(event.target.value)} placeholder="June allocation" maxLength={80} />
          </label>
          <button type="button" className="admin-btn" disabled={busy || !text.trim()} onClick={runPreview}>
            {busy ? 'Working…' : 'Preview file'}
          </button>
        </div>
      </section>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      {previewReady ? (
        <section className="admin-preview">
          <h2>Preview</h2>
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
              ? `Save ${formatCount(preview.newCodes)} and refresh ${formatCount(preview.existing)}`
              : `Save ${formatCount(preview.newCodes)} codes`}
          </button>
        </section>
      ) : null}

      <section className="import-sample">
        <div>
          <h2>Sample pack</h2>
          <p>Five codes are ready to try on the public check. Open one, or load the same file here again.</p>
        </div>
        <ul>
          {SAMPLE_CODES.map((item) => (
            <li key={item.code}>
              <Link to={`/verify-products?code=${item.code}`} target="_blank" rel="noreferrer">{item.code}</Link>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { loadText(SAMPLE_TEXT, 'sample-codes.txt'); setBatchLabel('sample') }}>
          Load sample file
        </button>
      </section>

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
