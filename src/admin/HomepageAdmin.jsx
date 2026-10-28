/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import MediaField from './cms/MediaField'
import { newId, saveDocument, useDocument } from './cms/useDocument'

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'videos', label: 'Videos' },
  { id: 'details', label: 'Details' },
]

function blankSlide() {
  return {
    tag: '',
    title: 'New slide',
    subtitle: '',
    image: '',
    cta: 'Discover Now',
    link: '/products',
    mobile: { title: 'New slide', subtitle: '', cta: 'Discover' },
  }
}

function blankFilm() {
  return {
    id: newId('film'),
    label: 'New video',
    shortLabel: '',
    title: '',
    poster: '',
    mp4: '',
    fallbackTitle: '',
    fallbackMessage: '',
  }
}

export default function HomepageAdmin() {
  const { data: home, setData: setHome, error: homeError } = useDocument('home')
  const { data: site, setData: setSite, error: siteError } = useDocument('site')
  const [section, setSection] = useState('hero')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const films = home.brandVideo?.films || []
  const slides = home.heroSlides || []

  function updateFilm(index, patch) {
    setHome((current) => ({
      ...current,
      brandVideo: {
        ...current.brandVideo,
        films: (current.brandVideo?.films || []).map((film, itemIndex) => (
          itemIndex === index ? { ...film, ...patch } : film
        )),
      },
    }))
  }

  function updateSlide(index, patch) {
    setHome((current) => ({
      ...current,
      heroSlides: (current.heroSlides || []).map((slide, itemIndex) => {
        if (itemIndex !== index) return slide
        const next = { ...slide, ...patch }
        next.mobile = {
          ...(slide.mobile || {}),
          ...(patch.title != null ? { title: patch.title } : {}),
          ...(patch.subtitle != null ? { subtitle: patch.subtitle } : {}),
          ...(patch.cta != null ? { cta: patch.cta } : {}),
          ...(patch.tag != null ? { tag: patch.tag } : {}),
        }
        return next
      }),
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

  const loadError = error || homeError || siteError

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Homepage</h1>
          <p>Edit one section at a time. Start with the hero, then the videos, then the header details. Images must be under 1 MB. Videos must be under 20 MB.</p>
        </div>
        <button type="button" className="admin-btn" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
      </header>
      {loadError ? <p className="admin-error">{loadError}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      <div className="section-tabs" role="tablist">
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={section === item.id}
            className={`admin-btn admin-btn--ghost section-tab${section === item.id ? ' is-selected' : ''}`}
            onClick={() => setSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {section === 'hero' ? (
        <section className="cms-card">
          <div className="cms-card__head">
            <h2>Hero slides</h2>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setHome({ ...home, heroSlides: [blankSlide(), ...slides] })}
            >
              Add slide
            </button>
          </div>
          <p className="media-field__hint">{slides.length} slide{slides.length === 1 ? '' : 's'}. Images must be under 1 MB. The public homepage still shows them full size.</p>
          {slides.map((slide, index) => (
            <article key={`${slide.link || 'slide'}-${index}`} className="section-row">
              <div className="section-row__fields">
                <div className="cms-grid">
                  <label className="admin-field"><span>Tag</span><input value={slide.tag || ''} onChange={(event) => updateSlide(index, { tag: event.target.value })} /></label>
                  <label className="admin-field"><span>Title</span><input value={slide.title || ''} onChange={(event) => updateSlide(index, { title: event.target.value })} /></label>
                  <label className="admin-field"><span>Button</span><input value={slide.cta || ''} onChange={(event) => updateSlide(index, { cta: event.target.value })} /></label>
                  <label className="admin-field"><span>Link</span><input value={slide.link || ''} onChange={(event) => updateSlide(index, { link: event.target.value })} /></label>
                </div>
                <label className="admin-field"><span>Subtitle</span><input value={slide.subtitle || ''} onChange={(event) => updateSlide(index, { subtitle: event.target.value })} /></label>
                <MediaField label="Image" accept="image/*" hint={false} value={slide.image || ''} onChange={(image) => updateSlide(index, { image })} />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => setHome({ ...home, heroSlides: slides.filter((_, itemIndex) => itemIndex !== index) })}
              >
                Remove
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {section === 'videos' ? (
        <section className="cms-card">
          <div className="cms-card__head">
            <h2>Videos</h2>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setHome({
                ...home,
                brandVideo: { ...home.brandVideo, films: [...films, blankFilm()] },
              })}
            >
              Add video
            </button>
          </div>
          <div className="cms-grid">
            <label className="admin-field">
              <span>Section title</span>
              <input
                value={home.brandVideo?.title || ''}
                onChange={(event) => setHome({ ...home, brandVideo: { ...home.brandVideo, title: event.target.value } })}
              />
            </label>
            <label className="admin-field">
              <span>Section subtitle</span>
              <input
                value={home.brandVideo?.subtitle || ''}
                onChange={(event) => setHome({ ...home, brandVideo: { ...home.brandVideo, subtitle: event.target.value } })}
              />
            </label>
          </div>
          <p className="media-field__hint">Poster images must be under 1 MB. Videos must be under 20 MB.</p>
          {films.map((film, index) => (
            <article key={film.id || index} className="section-row">
              <div className="section-row__fields">
                <div className="cms-grid">
                  <label className="admin-field"><span>Label</span><input value={film.label || ''} onChange={(event) => updateFilm(index, { label: event.target.value })} /></label>
                  <label className="admin-field"><span>Title</span><input value={film.title || ''} onChange={(event) => updateFilm(index, { title: event.target.value })} /></label>
                </div>
                <div className="cms-grid">
                  <MediaField label="Poster" accept="image/*" hint={false} value={film.poster || ''} onChange={(poster) => updateFilm(index, { poster })} />
                  <MediaField label="Video" accept="video/mp4,video/webm,video/quicktime" hint={false} value={film.mp4 || ''} onChange={(mp4) => updateFilm(index, { mp4 })} />
                </div>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => setHome({
                  ...home,
                  brandVideo: { ...home.brandVideo, films: films.filter((_, itemIndex) => itemIndex !== index) },
                })}
              >
                Remove
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {section === 'details' ? (
        <section className="cms-card">
          <h2>Header details</h2>
          <label className="admin-field"><span>Warning label</span><input value={site.warningBold || ''} onChange={(event) => setSite({ ...site, warningBold: event.target.value })} /></label>
          <label className="admin-field"><span>Warning text</span><textarea rows={2} value={site.warningText || ''} onChange={(event) => setSite({ ...site, warningText: event.target.value })} /></label>
          <MediaField label="Logo" accept="image/*" value={site.headerLogo || ''} onChange={(headerLogo) => setSite({ ...site, headerLogo })} />
        </section>
      ) : null}
    </div>
  )
}
