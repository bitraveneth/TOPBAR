/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileUp, X } from 'lucide-react'
import { adminFetch } from '../lib/adminApi'
import { formatCount, formatWhen } from '../lib/verifyFormat'
import MetricStrip from './MetricStrip'

const FORMATS = [
  { label: 'Security code', example: '2860994911575137' },
  { label: 'Text file', example: 'One code on each line' },
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
  const [phase, setPhase] = useState('idle')
  const [removingId, setRemovingId] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [imports, setImports] = useState([])
  const [revision, setRevision] = useState(0)
  const fileInput = useRef(null)
  const request = useRef(0)
  const busy = phase === 'reading' || phase === 'checking' || phase === 'saving'

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

  async function openText(contents, name) {
    const id = request.current + 1
    request.current = id
    setError('')
    setResult(null)
    setPreview(null)
    setPreviewText('')
    setText(contents)
    setFilename(name)
    setPhase('checking')
    try {
      const summary = await adminFetch('/api/admin/imports/preview', {
        method: 'POST',
        body: JSON.stringify({ text: contents, filename: name }),
      })
      if (request.current !== id) return
      setPreview(summary)
      setPreviewText(contents)
      setPhase('ready')
    } catch (err) {
      if (request.current !== id) return
      if (err.status === 401) navigate('/admin/login', { replace: true })
      else {
        setError(err.message)
        setPhase('failed')
      }
    }
  }

  async function takeFile(file) {
    if (!file) return
    setPhase('reading')
    setError('')
    setResult(null)
    try {
      const contents = await readFile(file)
      if (fileInput.current) fileInput.current.value = ''
      await openText(contents, file.name)
    } catch (err) {
      setError(err.message)
      setPhase('failed')
    }
  }

  async function removeImport(item) {
    if (!window.confirm(`Delete the import record for ${item.filename}? Codes already saved stay in the list.`)) return
    setRemovingId(item.id)
    setError('')
    try {
      await adminFetch(`/api/admin/imports/${item.id}`, { method: 'DELETE' })
      setImports((current) => current.filter((row) => row.id !== item.id))
    } catch (err) {
      if (err.status === 401) navigate('/admin/login', { replace: true })
      else setError(err.message)
    } finally {
      setRemovingId('')
    }
  }

  function clearFile() {
    setError('')
    setResult(null)
    setPreview(null)
    setPreviewText('')
    setText('')
    setFilename('')
    setPhase('idle')
    if (fileInput.current) fileInput.current.value = ''
  }

  async function runImport() {
    setPhase('saving')
    setError('')
    try {
      const record = await adminFetch('/api/admin/imports', {
        method: 'POST',
        body: JSON.stringify({ text, filename, mode, batchLabel }),
      })
      const added = record.inserted > 0
      const refreshed = record.updated > 0
      setResult(added || refreshed ? {
        ok: true,
        title: 'Import successful',
        message: [
          added ? `${formatCount(record.inserted)} new codes are saved.` : 'No new codes were added.',
          refreshed ? `${formatCount(record.updated)} existing codes were refreshed.` : '',
          record.skipped ? `${formatCount(record.skipped)} lines were skipped.` : '',
          'Open Codes to see them.',
        ].filter(Boolean).join(' '),
      } : {
        ok: false,
        title: record.invalid ? 'Nothing was saved' : 'Already imported',
        message: record.invalid
          ? `${formatCount(record.invalid)} lines could not be read, so no codes were added.`
          : 'These codes are already saved. Nothing new was added.',
      })
      setPreview(null)
      setPreviewText('')
      setText('')
      setFilename('')
      setPhase(added || refreshed ? 'done' : 'failed')
      setRevision((value) => value + 1)
    } catch (err) {
      if (err.status === 401) navigate('/admin/login', { replace: true })
      else {
        setError(err.message)
        setPhase('failed')
      }
    }
  }

  const previewReady = preview && previewText === text

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <h1>Import</h1>
          <p>Upload a .txt file with one security code on each line. Nothing is saved until you confirm the preview.</p>
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
              ref={fileInput}
              type="file"
              accept=".txt,.csv,text/plain,text/csv"
              onChange={(event) => takeFile(event.target.files?.[0])}
            />
          </label>
          {filename ? (
            <p className="import-file">
              <span>{filename}</span>
              <span>{formatCount(text.split(/\r?\n/).filter((line) => line.trim()).length)} lines</span>
              <button type="button" aria-label="Remove file" onClick={clearFile}><X size={14} /></button>
            </p>
          ) : null}
          {phase === 'reading' || phase === 'checking' || phase === 'saving' ? (
            <div className="import-progress" role="status" aria-live="polite">
              <span>{phase === 'reading' ? 'Reading your file…' : phase === 'saving' ? 'Saving codes…' : 'Checking codes…'}</span>
              <div className="import-progress__track" aria-hidden="true">
                <div className="import-progress__bar" />
              </div>
            </div>
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
            <span>Update the saved label for codes already in the list. Check counts stay as they are.</span>
          </button>
        </div>
        <div className="import-actions">
          <label className="admin-field">
            <span>Batch label</span>
            <input value={batchLabel} onChange={(event) => setBatchLabel(event.target.value)} placeholder="June allocation" maxLength={80} />
          </label>
        </div>
      </section>

      {error ? <p className="admin-error">{error}</p> : null}
      {result ? (
        <section className={result.ok ? 'import-result' : 'import-result import-result--bad'} role="status">
          <h2>{result.title}</h2>
          <p>{result.message}</p>
          <Link className="admin-btn" to="/admin/codes">View codes</Link>
        </section>
      ) : null}

      {previewReady ? (
        <section className="admin-preview" role="status">
          <h2>{preview.newCodes ? 'File checked' : 'Nothing new in this file'}</h2>
          <p className="import-pending">
            {preview.newCodes
              ? `${formatCount(preview.newCodes)} codes can be saved. They are not in the list until you press Save codes now.`
              : preview.existing
                ? `${formatCount(preview.existing)} codes are already saved.`
                : `${formatCount(preview.invalid)} lines could not be read.`}
          </p>
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
          <button
            type="button"
            className="admin-btn"
            disabled={busy || (mode === 'skip' ? preview.newCodes === 0 : preview.newCodes === 0 && preview.existing === 0)}
            onClick={runImport}
          >
            {phase === 'saving'
              ? 'Saving codes…'
              : mode === 'update'
                ? `Save codes now (${formatCount(preview.newCodes)} new, ${formatCount(preview.existing)} refresh)`
                : `Save codes now (${formatCount(preview.newCodes)})`}
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
                <th className="code-actions" aria-label="Delete" />
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
                  <td className="code-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger"
                      disabled={removingId === item.id}
                      onClick={() => removeImport(item)}
                    >
                      {removingId === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
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
