/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import MediaField from './cms/MediaField'
import { newId, saveDocument, useDocument } from './cms/useDocument'

const blankEvent = () => ({
  id: newId('ex'),
  name: '',
  date: '',
  place: '',
  booth: '',
  year: new Date().getFullYear(),
  image: '',
})

export default function ExhibitionAdmin() {
  const { data, setData, error: loadError, status } = useDocument('exhibition')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  function updateEvent(id, patch) {
    setData((current) => ({
      ...current,
      events: current.events.map((event) => event.id === id ? { ...event, ...patch } : event),
    }))
  }

  async function save() {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const events = data.events
        .filter((event) => event.name.trim())
        .map((event) => ({ ...event, year: Number(event.year) || new Date().getFullYear() }))
      const next = { ...data, events }
      await saveDocument('exhibition', next)
      setData(next)
      setNotice('Exhibitions saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadError) return <p className="admin-error">{loadError}</p>
  if (!data || status === 'loading') return <p className="admin-note">Loading exhibitions…</p>

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Exhibitions</h1>
          <p>Events on the public exhibitions page. Add a photo, date, city, and booth.</p>
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
        <label className="admin-field"><span>Intro</span><input value={data.helper || ''} onChange={(event) => setData({ ...data, helper: event.target.value })} /></label>
      </section>

      <div className="code-create__actions">
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setData({ ...data, events: [blankEvent(), ...data.events] })}>Add event</button>
      </div>

      {data.events.map((event) => (
        <section key={event.id} className="cms-card">
          <div className="cms-card__head">
            <h2>{event.name || 'New event'}</h2>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => setData({ ...data, events: data.events.filter((item) => item.id !== event.id) })}>Remove</button>
          </div>
          <div className="cms-grid">
            <label className="admin-field"><span>Name</span><input value={event.name} onChange={(e) => updateEvent(event.id, { name: e.target.value })} /></label>
            <label className="admin-field"><span>Date</span><input value={event.date} onChange={(e) => updateEvent(event.id, { date: e.target.value })} /></label>
            <label className="admin-field"><span>Place</span><input value={event.place} onChange={(e) => updateEvent(event.id, { place: e.target.value })} /></label>
            <label className="admin-field"><span>Booth</span><input value={event.booth} onChange={(e) => updateEvent(event.id, { booth: e.target.value })} /></label>
            <label className="admin-field"><span>Year</span><input inputMode="numeric" value={event.year} onChange={(e) => updateEvent(event.id, { year: e.target.value })} /></label>
          </div>
          <MediaField label="Photo" accept="image/*" value={event.image} onChange={(image) => updateEvent(event.id, { image })} />
        </section>
      ))}
    </div>
  )
}
