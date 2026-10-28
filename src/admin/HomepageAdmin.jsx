/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { adminFetch } from '../lib/adminApi'
import { getDefaultCmsMap } from '../lib/cmsDefaults'
import MediaField from './cms/MediaField'
import { newId, saveDocument } from './cms/useDocument'

export default function HomepageAdmin() {
  const [home, setHome] = useState(null)
  const [site, setSite] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    adminFetch('/api/admin/cms')
      .then((payload) => {
        if (cancelled) return
        const defaults = getDefaultCmsMap()
        setHome(structuredClone(payload.documents?.home || defaults.home))
        setSite(structuredClone(payload.documents?.site || defaults.site))
      })
      .catch((err) => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [])

  function updateFilm(index, patch) {
    setHome((current) => ({
      ...current,
      brandVideo: {
        ...current.brandVideo,
        films: current.brandVideo.films.map((film, itemIndex) => itemIndex === index ? { ...film, ...patch } : film),
      },
    }))
  }

  function updateSlide(index, patch) {
    setHome((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide, itemIndex) => itemIndex === index ? { ...slide, ...patch } : slide),
    }))
  }

  async function save() {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await saveDocument('site', site)
      await saveDocument('home', home)
      setNotice('Homepage saved. Reload the public site to see it.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (error && !home) return <p className="admin-error">{error}</p>
  if (!home || !site) return <p className="admin-note">Loading homepage…</p>
  const films = home.brandVideo?.films || []

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Homepage</h1>
          <p>Logo, warning bar, hero photos, and the product videos on the home page.</p>
        </div>
        <button type="button" className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </header>
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      <section className="cms-card">
        <h2>Site header</h2>
        <label className="admin-field"><span>Warning label</span><input value={site.warningBold || ''} onChange={(event) => setSite({ ...site, warningBold: event.target.value })} /></label>
        <label className="admin-field"><span>Warning text</span><textarea rows={2} value={site.warningText || ''} onChange={(event) => setSite({ ...site, warningText: event.target.value })} /></label>
        <MediaField label="Logo" accept="image/*" value={site.headerLogo || ''} onChange={(headerLogo) => setSite({ ...site, headerLogo })} />
      </section>

      <section className="cms-card">
        <div className="cms-card__head">
          <h2>Product videos</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setHome({
            ...home,
            brandVideo: {
              ...home.brandVideo,
              films: [...films, { id: newId('film'), label: 'New video', shortLabel: '', title: '', poster: '', mp4: '' }],
            },
          })}>Add video</button>
        </div>
        {films.map((film, index) => (
          <div key={film.id || index} className="cms-card">
            <div className="cms-card__head">
              <h3>{film.label || 'Video'}</h3>
              <button type="button" className="admin-btn admin-btn--danger" onClick={() => setHome({
                ...home,
                brandVideo: { ...home.brandVideo, films: films.filter((_, itemIndex) => itemIndex !== index) },
              })}>Remove</button>
            </div>
            <div className="cms-grid">
              <label className="admin-field"><span>Label</span><input value={film.label || ''} onChange={(event) => updateFilm(index, { label: event.target.value })} /></label>
              <label className="admin-field"><span>Title</span><input value={film.title || ''} onChange={(event) => updateFilm(index, { title: event.target.value })} /></label>
            </div>
            <MediaField label="Poster image" accept="image/*" value={film.poster || ''} onChange={(poster) => updateFilm(index, { poster })} />
            <MediaField label="Video file" accept="video/mp4,video/webm,video/quicktime" value={film.mp4 || ''} onChange={(mp4) => updateFilm(index, { mp4 })} />
          </div>
        ))}
      </section>

      <section className="cms-card">
        <div className="cms-card__head">
          <h2>Hero slides</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setHome({
            ...home,
            heroSlides: [{ tag: '', title: 'New slide', subtitle: '', image: '', cta: 'Discover Now', link: '/products' }, ...home.heroSlides],
          })}>Add slide</button>
        </div>
        {home.heroSlides.map((slide, index) => (
          <div key={`${slide.title}-${index}`} className="cms-card">
            <div className="cms-card__head">
              <h3>{slide.title || 'Slide'}</h3>
              <button type="button" className="admin-btn admin-btn--danger" onClick={() => setHome({ ...home, heroSlides: home.heroSlides.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
            </div>
            <div className="cms-grid">
              <label className="admin-field"><span>Tag</span><input value={slide.tag || ''} onChange={(event) => updateSlide(index, { tag: event.target.value })} /></label>
              <label className="admin-field"><span>Title</span><input value={slide.title || ''} onChange={(event) => updateSlide(index, { title: event.target.value })} /></label>
              <label className="admin-field"><span>Button</span><input value={slide.cta || ''} onChange={(event) => updateSlide(index, { cta: event.target.value })} /></label>
              <label className="admin-field"><span>Link</span><input value={slide.link || ''} onChange={(event) => updateSlide(index, { link: event.target.value })} /></label>
            </div>
            <label className="admin-field"><span>Subtitle</span><textarea rows={2} value={slide.subtitle || ''} onChange={(event) => updateSlide(index, { subtitle: event.target.value })} /></label>
            <MediaField label="Image" accept="image/*" value={slide.image || ''} onChange={(image) => updateSlide(index, { image })} />
          </div>
        ))}
      </section>
    </div>
  )
}
