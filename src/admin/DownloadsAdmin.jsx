/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import MediaField from './cms/MediaField'
import { newId, saveDocument, useDocument } from './cms/useDocument'

function formatBytes(size) {
  if (!size) return ''
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function fileType(media) {
  const name = media.originalName || media.url || ''
  if (media.mime === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) return 'PDF'
  if (String(media.mime).includes('zip') || name.toLowerCase().endsWith('.zip')) return 'ZIP'
  const ext = name.split('.').pop()
  return ext ? ext.toUpperCase() : 'FILE'
}

function FileRow({ file, onChange, onRemove }) {
  return (
    <div className="download-row">
      <label className="admin-field">
        <span>Title</span>
        <input value={file.title} onChange={(event) => onChange({ title: event.target.value })} />
      </label>
      <MediaField
        label="File"
        accept=".pdf,.zip,.txt,application/pdf,application/zip,text/plain"
        value={file.url}
        onChange={(url) => onChange({ url })}
        onUploaded={(media) => onChange({
          url: media.url,
          type: fileType(media),
          size: formatBytes(media.size),
          title: file.title || media.originalName.replace(/\.[^.]+$/, ''),
        })}
      />
      <button type="button" className="admin-btn admin-btn--danger" onClick={onRemove}>Remove</button>
    </div>
  )
}

export default function DownloadsAdmin() {
  const { data, setData, error: loadError, status } = useDocument('downloads')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  function updateGroup(id, patch) {
    setData((current) => ({
      ...current,
      groups: current.groups.map((group) => group.id === id ? { ...group, ...patch } : group),
    }))
  }

  function updateFile(groupId, fileId, patch) {
    setData((current) => ({
      ...current,
      groups: current.groups.map((group) => group.id === groupId ? {
        ...group,
        files: group.files.map((file) => file.id === fileId ? { ...file, ...patch } : file),
      } : group),
    }))
  }

  async function save() {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await saveDocument('downloads', data)
      setNotice('Downloads saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadError) return <p className="admin-error">{loadError}</p>
  if (!data || status === 'loading') return <p className="admin-note">Loading downloads…</p>

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Downloads</h1>
          <p>Upload a document, give it a title, or remove it from the public downloads page.</p>
        </div>
        <button type="button" className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </header>
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      <section className="cms-card">
        <div className="cms-grid">
          <label className="admin-field"><span>Eyebrow</span><input value={data.eyebrow || ''} onChange={(event) => setData({ ...data, eyebrow: event.target.value })} /></label>
          <label className="admin-field"><span>Title</span><input value={data.title || ''} onChange={(event) => setData({ ...data, title: event.target.value })} /></label>
        </div>
        <label className="admin-field"><span>Intro</span><textarea rows={2} value={data.intro || ''} onChange={(event) => setData({ ...data, intro: event.target.value })} /></label>
      </section>

      <div className="code-create__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setData({ ...data, groups: [...data.groups, { id: newId('group'), title: 'New group', files: [] }] })}>Add group</button>
      </div>

      {data.groups.map((group) => (
        <section key={group.id} className="cms-card">
          <div className="cms-card__head">
            <label className="admin-field">
              <span>Group title</span>
              <input value={group.title} onChange={(event) => updateGroup(group.id, { title: event.target.value })} />
            </label>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => setData({ ...data, groups: data.groups.filter((item) => item.id !== group.id) })}>Remove group</button>
          </div>
          {group.files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onChange={(patch) => updateFile(group.id, file.id, patch)}
              onRemove={() => updateGroup(group.id, { files: group.files.filter((item) => item.id !== file.id) })}
            />
          ))}
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => updateGroup(group.id, { files: [...group.files, { id: newId('file'), title: '', url: '', type: '', size: '' }] })}>Add file</button>
        </section>
      ))}

      <section className="cms-card">
        <div className="cms-card__head">
          <h2>Support documents</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setData({ ...data, resources: [...data.resources, { id: newId('file'), title: '', url: '', type: '', size: '' }] })}>Add file</button>
        </div>
        {data.resources.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            onChange={(patch) => setData({
              ...data,
              resources: data.resources.map((item) => item.id === file.id ? { ...item, ...patch } : item),
            })}
            onRemove={() => setData({ ...data, resources: data.resources.filter((item) => item.id !== file.id) })}
          />
        ))}
      </section>
    </div>
  )
}
