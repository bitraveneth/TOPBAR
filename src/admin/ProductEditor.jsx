/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MediaField from './cms/MediaField'
import { saveDocument, useDocument } from './cms/useDocument'

const blank = {
  slug: '',
  name: '',
  category: 'Disposable',
  tagline: '',
  description: '',
  image: '',
  video: '',
  specs: [],
  colorVariants: [],
  featured: false,
  isNew: false,
}

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

function productFrom(data, slug, isNew) {
  if (isNew) return structuredClone(blank)
  const found = data?.items?.find((item) => item.slug === slug)
  if (!found) return null
  const next = structuredClone(found)
  if (!Array.isArray(next.colorVariants)) next.colorVariants = []
  return next
}

export default function ProductEditor() {
  const { slug } = useParams()
  const isNew = slug === 'new'
  const navigate = useNavigate()
  const { data, synced, error: loadError } = useDocument('products')
  const edited = useRef({ slug, dirty: false })
  const initial = productFrom(data, slug, isNew)
  const [seen, setSeen] = useState({ data, slug })
  const [product, setProduct] = useState(initial)
  const [specsText, setSpecsText] = useState((initial?.specs || []).join('\n'))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const keepEdits = edited.current.dirty && edited.current.slug === slug

  if (seen.data !== data || seen.slug !== slug) {
    setSeen({ data, slug })
    if (!keepEdits) {
      const next = productFrom(data, slug, isNew)
      if (next) {
        setProduct(next)
        setSpecsText((next.specs || []).join('\n'))
        setError('')
      } else if (synced) {
        setProduct(null)
        setError('That product is not in the catalog.')
      }
    }
  }

  function markEdited() {
    edited.current = { slug, dirty: true }
  }

  function setField(name, value) {
    markEdited()
    setProduct((current) => ({ ...current, [name]: value }))
  }

  function setVariant(index, patch) {
    markEdited()
    setProduct((current) => ({
      ...current,
      colorVariants: (current.colorVariants || []).map((variant, itemIndex) => (
        itemIndex === index ? { ...variant, ...patch } : variant
      )),
    }))
  }

  async function save(event) {
    event.preventDefault()
    const nextSlug = slugify(product.slug || product.name)
    if (!product.name.trim() || !nextSlug) {
      setError('Enter a product name.')
      return
    }
    if (!product.image) {
      setError('Add a product image.')
      return
    }
    const items = data.items.filter((item) => item.slug !== slug)
    if (items.some((item) => item.slug === nextSlug)) {
      setError('Another product already uses that link name.')
      return
    }
    const next = {
      ...product,
      slug: nextSlug,
      name: product.name.trim(),
      specs: specsText.split('\n').map((line) => line.trim()).filter(Boolean),
      colorVariants: (product.colorVariants || []).filter((variant) => variant.name?.trim()),
    }
    setSaving(true)
    setError('')
    try {
      await saveDocument('products', { ...data, items: isNew ? [next, ...data.items] : data.items.map((item) => item.slug === slug ? next : item) })
      navigate('/admin/products', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Remove ${product.name}?`)) return
    setSaving(true)
    try {
      await saveDocument('products', { ...data, items: data.items.filter((item) => item.slug !== slug) })
      navigate('/admin/products', { replace: true })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (!product) {
    if (!synced && !loadError) return null
    return <p className="admin-error">{error || loadError || 'That product is not in the catalog.'}</p>
  }

  return (
    <form className="admin-page cms-stack" onSubmit={save}>
      <header className="admin-page__head">
        <div>
          <h1>{isNew ? 'New product' : product.name}</h1>
          <p>Photos, video, flavors, and the text on the product page.</p>
        </div>
        <div className="admin-page__actions">
          <Link className="admin-btn admin-btn--ghost" to="/admin/products">Back</Link>
          <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
        </div>
      </header>
      {error || loadError ? <p className="admin-error">{error || loadError}</p> : null}

      <section className="cms-card">
        <div className="cms-grid">
          <label className="admin-field">
            <span>Name</span>
            <input value={product.name} onChange={(event) => {
              markEdited()
              const name = event.target.value
              setProduct((current) => ({ ...current, name, slug: isNew ? slugify(name) : current.slug }))
            }} required />
          </label>
          <label className="admin-field">
            <span>Link name</span>
            <input value={product.slug} onChange={(event) => setField('slug', slugify(event.target.value))} required />
          </label>
          <label className="admin-field">
            <span>Category</span>
            <input value={product.category || ''} onChange={(event) => setField('category', event.target.value)} />
          </label>
          <label className="admin-field">
            <span>Tagline</span>
            <input value={product.tagline || ''} onChange={(event) => setField('tagline', event.target.value)} />
          </label>
        </div>
        <label className="admin-field">
          <span>Description</span>
          <textarea rows={4} value={product.description || ''} onChange={(event) => setField('description', event.target.value)} />
        </label>
        <div className="cms-checks">
          <label className="admin-remember"><input type="checkbox" checked={Boolean(product.featured)} onChange={(event) => setField('featured', event.target.checked)} /> Featured</label>
          <label className="admin-remember"><input type="checkbox" checked={Boolean(product.isNew)} onChange={(event) => setField('isNew', event.target.checked)} /> Mark as new</label>
        </div>
      </section>

      <section className="cms-card">
        <h2>Media</h2>
        <div className="cms-grid">
          <MediaField label="Main image" accept="image/*" value={product.image} onChange={(image) => setField('image', image)} />
          <MediaField label="Product video" accept="video/mp4,video/webm,video/quicktime" value={product.video || ''} onChange={(video) => setField('video', video)} />
        </div>
      </section>

      <section className="cms-card">
        <div className="cms-card__head">
          <h2>Flavors</h2>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setField('colorVariants', [...(product.colorVariants || []), { name: '', hex: '#CCFF00', image: '' }])}>Add flavor</button>
        </div>
        <p className="media-field__hint">These are the flavors already used on the product page. Edit one, or add a new flavor. Flavor images must be under 1 MB.</p>
        {(product.colorVariants || []).length === 0 ? <p className="admin-note">No flavors yet.</p> : null}
        {(product.colorVariants || []).map((variant, index) => (
          <div key={index} className="flavor-row">
            <MediaField label="Image" accept="image/*" hint={false} value={variant.image || ''} onChange={(image) => setVariant(index, { image })} />
            <div className="flavor-row__meta">
              <label className="admin-field">
                <span>Name</span>
                <input value={variant.name} onChange={(event) => setVariant(index, { name: event.target.value })} />
              </label>
              <label className="admin-field">
                <span>Color</span>
                <input type="color" value={variant.hex || '#CCFF00'} onChange={(event) => setVariant(index, { hex: event.target.value })} />
              </label>
              <button type="button" className="admin-btn admin-btn--danger" onClick={() => setField('colorVariants', product.colorVariants.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
            </div>
          </div>
        ))}
      </section>

      <section className="cms-card">
        <label className="admin-field">
          <span>Specs, one per line</span>
          <textarea rows={5} value={specsText} onChange={(event) => { markEdited(); setSpecsText(event.target.value) }} />
        </label>
      </section>

      {!isNew ? (
        <div className="code-create__actions">
          <button type="button" className="admin-btn admin-btn--danger" onClick={remove}>Delete product</button>
        </div>
      ) : null}
    </form>
  )
}
