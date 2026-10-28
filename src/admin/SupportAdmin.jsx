/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import { newId, saveDocument, useDocument } from './cms/useDocument'

export default function SupportAdmin() {
  const { data, setData, error: loadError, status } = useDocument('support')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  function updateTopic(id, patch) {
    setData((current) => ({
      ...current,
      topics: current.topics.map((topic) => topic.id === id ? { ...topic, ...patch } : topic),
    }))
  }

  async function save() {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const next = {
        ...data,
        topics: data.topics.filter((topic) => topic.title.trim()).map((topic) => ({
          ...topic,
          details: String(topic.detailsText ?? (topic.details || []).join('\n')).split('\n').map((line) => line.trim()).filter(Boolean),
        })),
        faqs: data.faqs.filter((faq) => faq.q.trim() && faq.a.trim()),
      }
      next.topics.forEach((topic) => { delete topic.detailsText })
      await saveDocument('support', next)
      setData(next)
      setNotice('Support page saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loadError) return <p className="admin-error">{loadError}</p>
  if (!data || status === 'loading') return <p className="admin-note">Loading support…</p>

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Support</h1>
          <p>Hero text, contact categories, and the questions on the support page.</p>
        </div>
        <button type="button" className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </header>
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      <section className="cms-card">
        <div className="cms-grid">
          <label className="admin-field"><span>Eyebrow</span><input value={data.eyebrow || ''} onChange={(event) => setData({ ...data, eyebrow: event.target.value })} /></label>
          <label className="admin-field"><span>Title</span><input value={data.title || ''} onChange={(event) => setData({ ...data, title: event.target.value })} /></label>
          <label className="admin-field"><span>Email</span><input value={data.email || ''} onChange={(event) => setData({ ...data, email: event.target.value })} /></label>
        </div>
        <label className="admin-field"><span>Helper line</span><input value={data.helper || ''} onChange={(event) => setData({ ...data, helper: event.target.value })} /></label>
        <label className="admin-field"><span>Footer note</span><textarea rows={2} value={data.notice || ''} onChange={(event) => setData({ ...data, notice: event.target.value })} /></label>
      </section>

      {data.topics.map((topic) => (
        <section key={topic.id} className="cms-card">
          <div className="cms-card__head">
            <h2>{topic.title || 'Category'}</h2>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => setData({ ...data, topics: data.topics.filter((item) => item.id !== topic.id) })}>Remove</button>
          </div>
          <div className="cms-grid">
            <label className="admin-field"><span>Tile label</span><input value={topic.title} onChange={(event) => updateTopic(topic.id, { title: event.target.value })} /></label>
            <label className="admin-field"><span>Form title</span><input value={topic.formTitle || ''} onChange={(event) => updateTopic(topic.id, { formTitle: event.target.value })} /></label>
          </div>
          <label className="admin-field"><span>Description</span><textarea rows={2} value={topic.description || ''} onChange={(event) => updateTopic(topic.id, { description: event.target.value })} /></label>
          <label className="admin-field">
            <span>Details, one per line</span>
            <textarea rows={3} value={topic.detailsText ?? (topic.details || []).join('\n')} onChange={(event) => updateTopic(topic.id, { detailsText: event.target.value })} />
          </label>
        </section>
      ))}
      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setData({
        ...data,
        topics: [...data.topics, { id: newId('topic'), icon: 'contact', title: 'New category', heading: '', description: '', details: [], formTitle: 'Contact form', issueType: '', lockIssueType: false }],
      })}>Add category</button>

      <section className="cms-card">
        <div className="cms-card__head">
          <h2>Questions</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setData({ ...data, faqs: [...data.faqs, { id: newId('faq'), q: '', a: '' }] })}>Add question</button>
        </div>
        {data.faqs.map((faq) => (
          <div key={faq.id || faq.q} className="cms-card faq-edit">
            <label className="admin-field"><span>Question</span><input value={faq.q} onChange={(event) => setData({ ...data, faqs: data.faqs.map((item) => item === faq ? { ...item, q: event.target.value } : item) })} /></label>
            <label className="admin-field"><span>Answer</span><textarea rows={3} value={faq.a} onChange={(event) => setData({ ...data, faqs: data.faqs.map((item) => item === faq ? { ...item, a: event.target.value } : item) })} /></label>
            <button type="button" className="admin-btn admin-btn--danger" onClick={() => setData({ ...data, faqs: data.faqs.filter((item) => item !== faq) })}>Remove</button>
          </div>
        ))}
      </section>
    </div>
  )
}
