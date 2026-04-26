import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import products from '../data/products.json'

function ProductDetail() {
  const { slug } = useParams()
  const slugAliasMap = {
    'aegis-legend-5': 'topbar-9900-puffs',
    'topbar-mango': 'topbar-9900-puffs',
  }
  const resolvedSlug = slugAliasMap[slug] || slug
  const product = products.find((p) => p.slug === resolvedSlug)

  const colorVariants = useMemo(() => {
    if (!product) return []
    if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
      return product.colorVariants
    }
    return [{ name: 'Default', hex: '#CCFF00', image: product.image }]
  }, [product])

  const [activeColorName, setActiveColorName] = useState(colorVariants[0]?.name)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  )
  const multiFlavour = colorVariants.length > 1
  const flavourCollapsible = multiFlavour && !isDesktop
  const [flavourOpen, setFlavourOpen] = useState(false)

  useEffect(() => {
    setActiveColorName(colorVariants[0]?.name)
  }, [colorVariants])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (flavourCollapsible) setFlavourOpen(false)
  }, [product?.slug, flavourCollapsible])

  const activeVariant = colorVariants.find((variant) => variant.name === activeColorName) || colorVariants[0]
  const activeImage = activeVariant?.image || product?.image

  const featureShowcaseTiles = useMemo(() => {
    if (!product) return []
    const fallbackImage = 'https://placehold.co/1200x800/0b1120/9fb3d8?text=Feature+Image'
    const sourceTiles =
      Array.isArray(product.featureShowcase) && product.featureShowcase.length > 0
        ? product.featureShowcase
        : (product.specs || []).slice(0, 5).map((spec) => ({
            title: spec,
            image: fallbackImage,
          }))

    return sourceTiles.length > 0
      ? sourceTiles
      : [{
          title: 'Product Features',
          image: fallbackImage,
        }]
  }, [product])
  const isSingleFeature = featureShowcaseTiles.length === 1
  const showProductFeaturesHeading = product && product.showProductFeaturesHeading !== false

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h1>Product Not Found</h1>
        <p style={{ marginBottom: '1.5rem' }}>The product you're looking for doesn't exist in our catalog.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3)

  return (
    <section className="section product-detail-page">
      <div className="container">
        <div className="detail-layout detail-layout--hero">
          <div className="detail-image detail-image--large">
            <img src={activeImage} alt={`${product.name} ${activeVariant?.name || ''}`} />
          </div>
          <div className="detail-info">
            <span className="tag">{product.category}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <div
              className={`detail-color-picker${flavourCollapsible ? ' detail-color-picker--collapsible' : ''}${flavourCollapsible && flavourOpen ? ' is-flavour-open' : ''}${flavourCollapsible && !flavourOpen ? ' is-flavour-closed' : ''}`}
              aria-label="Choose product flavour"
            >
              {flavourCollapsible ? (
                <>
                  <button
                    type="button"
                    className="detail-color-picker__toggle"
                    onClick={() => setFlavourOpen((o) => !o)}
                    aria-expanded={flavourOpen}
                    aria-controls="flavour-panel"
                    id="flavour-toggle"
                  >
                    <span className="detail-color-picker__toggle-thumb" aria-hidden>
                      <img
                        src={activeImage}
                        alt=""
                        className="detail-color-picker__toggle-thumb-img"
                        width={44}
                        height={44}
                        decoding="async"
                      />
                    </span>
                    <span className="detail-color-picker__title" id="flavour-title">
                      Choose Flavour
                    </span>
                    <span className="detail-color-picker__summary">{activeVariant?.name}</span>
                    <ChevronDown className="detail-color-picker__chev" size={20} strokeWidth={2.25} aria-hidden />
                  </button>
                  <div
                    id="flavour-panel"
                    className="detail-color-picker__panel"
                    role="group"
                    aria-labelledby="flavour-title"
                    aria-hidden={!flavourOpen ? true : undefined}
                    inert={!flavourOpen}
                  >
                    <div className="detail-color-picker__panel-inner">
                      <div className="detail-flavour-preview" aria-live="polite" aria-atomic="true">
                        <img
                          src={activeImage}
                          alt={activeVariant?.name ? `${product.name}, ${activeVariant.name}` : product.name}
                          className="detail-flavour-preview__img"
                          loading="eager"
                          decoding="async"
                        />
                        <p className="detail-flavour-preview__caption">{activeVariant?.name}</p>
                      </div>
                      <div className="detail-color-picker__options-scroller">
                        <div className="detail-color-picker__options">
                          {colorVariants.map((variant) => (
                            <button
                              key={variant.name}
                              type="button"
                              className={`detail-flavour-chip ${activeColorName === variant.name ? 'is-active' : ''}`}
                              style={{ '--variant-color': variant.hex }}
                              onClick={() => setActiveColorName(variant.name)}
                              aria-label={variant.name}
                              title={variant.name}
                            >
                              <span className="detail-flavour-chip__dot" />
                              <span className="detail-flavour-chip__name">{variant.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {flavourOpen && (
                        <p className="detail-color-picker__label">Selected: {activeVariant?.name}</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3>Choose Flavour</h3>
                  <div className="detail-color-picker__options">
                    {colorVariants.map((variant) => (
                      <button
                        key={variant.name}
                        type="button"
                        className={`detail-flavour-chip ${activeColorName === variant.name ? 'is-active' : ''}`}
                        style={{ '--variant-color': variant.hex }}
                        onClick={() => setActiveColorName(variant.name)}
                        aria-label={variant.name}
                        title={variant.name}
                      >
                        <span className="detail-flavour-chip__dot" />
                        <span className="detail-flavour-chip__name">{variant.name}</span>
                      </button>
                    ))}
                  </div>
                  <p className="detail-color-picker__label">Selected: {activeVariant?.name}</p>
                </>
              )}
            </div>

            <Link className="back-link" to="/products">
              <ArrowLeft size={16} />
              Back to all products
            </Link>
          </div>
        </div>

        <div className="detail-features">
          {showProductFeaturesHeading && (
            <h2 className="detail-section-title">Product Features</h2>
          )}
          <div
            className={`detail-feature-board${isSingleFeature ? ' detail-feature-board--single' : ''} detail-feature-board--reveal`}
          >
            {featureShowcaseTiles.map((item, index) => {
              const showTileTitle = item.showTitle !== false && Boolean(item.title)
              const featureAlt = item.alt || (item.title ? String(item.title) : `${product.name} feature image`)
              return (
                <article
                  key={`${item.image}-${index}`}
                  className={`detail-feature-tile ${item.className || ''}`.trim()}
                >
                  <img src={item.image} alt={featureAlt} loading="lazy" />
                  {showTileTitle && (
                    <div className="detail-feature-tile__overlay">
                      <h3>{item.title}</h3>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        {related.length > 0 && (
          <div className="detail-related">
            <h3>Related Products</h3>
            <div className="product-grid">
              {related.map((p) => (
                <Link key={p.slug} to={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <article className="product-card">
                    <div className="product-card__image">
                      <img src={p.image} alt={p.name} loading="lazy" />
                      {p.isNew && <span className="product-card__badge">New</span>}
                    </div>
                    <div className="product-card__body">
                      <p className="product-card__category">{p.category}</p>
                      <h3 className="product-card__name">{p.name}</h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductDetail
