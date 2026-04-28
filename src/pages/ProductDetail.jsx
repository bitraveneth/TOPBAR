import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Battery, Cable, ChevronDown, Droplets, Gauge, Sparkles, Wind } from 'lucide-react'
import { useCms } from '../contexts/CmsContext'

function ProductDetail() {
  const { merged } = useCms()
  const catalog = merged.products?.items ?? []
  const slugAliasMap = merged.products?.slugAliases ?? {}
  const { slug } = useParams()
  const resolvedSlug = slugAliasMap[slug] || slug
  const product = catalog.find((p) => p.slug === resolvedSlug)

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
  const isTopbar9900 = product?.slug === 'topbar-9900-puffs'
  const isTopbar8000 = product?.slug === 'topbar-8000-puffs'
  const isTopbarSeries = isTopbar9900 || isTopbar8000
  const productFeatureCards = isTopbar9900
    ? [
        { label: 'Puffs', value: 'Up to 9900', icon: 'puffs' },
        { label: 'Charging Port', value: 'Type-C', icon: 'port' },
        { label: 'Battery Capacity', value: '500 mAh', icon: 'battery' },
        { label: 'Display', value: 'Battery + E-liquid', icon: 'display' },
        { label: 'Coil', value: '1.0Ω Mesh', icon: 'coil' },
        { label: 'Airflow', value: 'Smooth Draw', icon: 'airflow' },
        { label: 'Nicotine Strength', value: '50 mg/mL', icon: 'coil' },
        { label: 'Input', value: '5V DC, 1A', icon: 'port' },
      ]
    : isTopbar8000
      ? [
          { label: 'Puffs', value: 'Up to 8000', icon: 'puffs' },
          { label: 'Charging Port', value: 'Type-C', icon: 'port' },
          { label: 'Battery', value: 'Rechargeable', icon: 'battery' },
          { label: 'Display', value: 'Digital Screen', icon: 'display' },
          { label: 'Coil', value: '1.0Ω Mesh', icon: 'coil' },
          { label: 'Airflow', value: 'Smooth Draw', icon: 'airflow' },
          { label: 'Nicotine Strength', value: '50 mg/mL', icon: 'coil' },
          { label: 'Input', value: '5V DC, 1A', icon: 'port' },
        ]
      : []
  const seriesPuffCount = isTopbar9900 ? '9900' : isTopbar8000 ? '8000' : ''
  const seriesSpecsTitle = isTopbar9900 ? 'TOPBAR 9900 Key Specs' : 'TOPBAR 8000 Key Specs'
  const seriesSpecsImage = isTopbar9900
    ? '/images/community/specs-showcase.png'
    : '/images/products/topbar-8000-extra-2.png'
  const seriesHeroImage = isTopbar9900
    ? '/images/community/puff-hero-device.png'
    : '/images/products/topbar-8000-extra-1.png'
  const seriesExploreShowcaseImage = isTopbar9900
    ? '/images/products/topbar-9900-feature-spec-grid.png'
    : '/images/products/topbar-8000-feature.png'

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h1>Product Not Found</h1>
        <p style={{ marginBottom: '1.5rem' }}>The product you're looking for doesn't exist in our catalog.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  const related = catalog
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3)

  const relatedCarouselItems = useMemo(() => {
    if (!product) return []

    if (isTopbarSeries) {
      const topbar9900 = catalog.find((p) => p.slug === 'topbar-9900-puffs')
      const topbar8000 = catalog.find((p) => p.slug === 'topbar-8000-puffs')

      const from9900 = (topbar9900?.colorVariants || [])
        .filter((variant) => variant?.name)
        .slice(0, 8)
        .map((variant) => ({
          id: `topbar-9900-${variant.name}`,
          slug: topbar9900.slug,
          image: variant.image || topbar9900.image,
          title: variant.name,
          subtitle: 'TOPBAR 9900 Puffs',
          accentColor: variant.hex || '#CCFF00',
        }))

      const from8000 = (topbar8000?.colorVariants || [])
        .filter((variant) => variant?.name)
        .slice(0, 8)
        .map((variant) => ({
          id: `topbar-8000-${variant.name}`,
          slug: topbar8000.slug,
          image: variant.image || topbar8000.image,
          title: variant.name,
          subtitle: 'TOPBAR 8000 Puffs',
          accentColor: variant.hex || '#9BE15D',
        }))

      return [...from9900, ...from8000]
    }

    return related.map((p) => ({
      id: p.slug,
      slug: p.slug,
      image: p.image,
      title: p.name,
      subtitle: p.category,
      isNew: p.isNew,
      accentColor: '#CCFF00',
    }))
  }, [catalog, isTopbarSeries, product, related])

  const relatedHeading = isTopbarSeries ? 'Explore More Products' : 'Related Products'
  const [coverflowIndex, setCoverflowIndex] = useState(0)
  const [isCoverflowHovered, setIsCoverflowHovered] = useState(false)

  useEffect(() => {
    setCoverflowIndex(0)
  }, [product?.slug])

  useEffect(() => {
    if (!isTopbarSeries || relatedCarouselItems.length <= 1) return undefined
    if (isCoverflowHovered) return undefined
    const timer = window.setInterval(() => {
      setCoverflowIndex((prev) => (prev + 1) % relatedCarouselItems.length)
    }, 3800)
    return () => window.clearInterval(timer)
  }, [isTopbarSeries, isCoverflowHovered, relatedCarouselItems.length])

  return (
    <section className="section product-detail-page">
      <div className="container">
        <div className="detail-layout detail-layout--hero">
          <div className="detail-image detail-image--large">
            <img src={activeImage} alt={`${product.name} ${activeVariant?.name || ''}`} />
          </div>
          <div className="detail-info">
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            {!flavourCollapsible && <h3 className="detail-flavour-heading">Choose Flavour</h3>}
            <div
              className={`detail-color-picker${flavourCollapsible ? ' detail-color-picker--collapsible' : ' detail-color-picker--desktop'}${flavourCollapsible && flavourOpen ? ' is-flavour-open' : ''}${flavourCollapsible && !flavourOpen ? ' is-flavour-closed' : ''}`}
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

          </div>
        </div>

        {!isTopbarSeries && (
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
        )}

        {isTopbarSeries && (
          <>
            <h1 className="detail-spec-bento__title">{seriesSpecsTitle}</h1>
            <div className="detail-spec-bento">
              <div className="detail-spec-bento__grid">
                <article className={`detail-spec-bento__hero${isTopbar8000 ? ' detail-spec-bento__hero--8000' : ''}`}>
                  <img
                    src={seriesSpecsImage}
                    alt={`${product.name} product and package`}
                    loading="lazy"
                  />
                </article>
                <div className="detail-spec-bento__cards">
                  {productFeatureCards.map((item, idx) => (
                    <article
                      key={item.label}
                      className={`detail-spec-bento__card ${idx < 2 ? 'detail-spec-bento__card--wide' : 'detail-spec-bento__card--mini'}`}
                    >
                      <div className="detail-spec-bento__icon" aria-hidden>
                        {item.icon === 'puffs' && <Sparkles size={20} />}
                        {item.icon === 'port' && <Cable size={20} />}
                        {item.icon === 'battery' && <Battery size={20} />}
                        {item.icon === 'display' && <Gauge size={20} />}
                        {item.icon === 'coil' && <Droplets size={20} />}
                        {item.icon === 'airflow' && <Wind size={20} />}
                      </div>
                      <p className="detail-spec-bento__label">{item.label}</p>
                      <h4 className="detail-spec-bento__value">{item.value}</h4>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {isTopbarSeries && (
          <section className="detail-puff-hero" aria-label={`Up to ${seriesPuffCount} puffs highlight`}>
            <div className="detail-puff-hero__split">
              <div className="detail-puff-hero__media">
                <img
                  className="detail-puff-hero__bg"
                  src={seriesHeroImage}
                  alt={`${product.name} visual`}
                  loading="lazy"
                />
              </div>
              <div className="detail-puff-hero__content">
                <h2 className="detail-puff-hero__headline">
                  <span className="detail-puff-hero__headline-number">{seriesPuffCount}</span>
                  <span className="detail-puff-hero__headline-unit">PUFFS</span>
                </h2>
              </div>
            </div>
          </section>
        )}

        {isTopbar8000 && (
          <section className="detail-8000-after-hero" aria-label="TOPBAR 8000 feature image">
            <img src="/images/products/topbar-8000-extra-3.png" alt="TOPBAR 8000 feature grid" loading="lazy" />
          </section>
        )}

        {isTopbar9900 && (
          <section className="detail-related__showcase" aria-label="Explore products showcase">
            <img src={seriesExploreShowcaseImage} alt={`${product.name} feature showcase`} loading="lazy" />
          </section>
        )}

        {relatedCarouselItems.length > 0 && (
          <div className="detail-related">
            {isTopbarSeries ? <h1 className="detail-related__title">{relatedHeading}</h1> : <h3>{relatedHeading}</h3>}
            {isTopbarSeries ? (
              <>
                <div
                  className="detail-coverflow"
                  aria-label="Explore more flavours"
                  onMouseEnter={() => setIsCoverflowHovered(true)}
                  onMouseLeave={() => setIsCoverflowHovered(false)}
                >
                  <button
                    type="button"
                    className="detail-coverflow__nav detail-coverflow__nav--prev"
                    onClick={() => setCoverflowIndex((prev) => (prev - 1 + relatedCarouselItems.length) % relatedCarouselItems.length)}
                    aria-label="Previous flavour"
                  >
                    ‹
                  </button>
                  <div className="detail-coverflow__stage">
                    {relatedCarouselItems.map((item, idx) => {
                      const total = relatedCarouselItems.length
                      const rawOffset = idx - coverflowIndex
                      const circularOffset =
                        Math.abs(rawOffset) > total / 2
                          ? rawOffset > 0
                            ? rawOffset - total
                            : rawOffset + total
                          : rawOffset
                      const absOffset = Math.abs(circularOffset)
                      const isActive = circularOffset === 0
                      if (absOffset > 2) return null

                      return (
                        <Link
                          key={item.id}
                          to={`/products/${item.slug}`}
                          className={`detail-coverflow__item ${isActive ? 'is-active' : ''}`}
                          style={{
                            '--offset': circularOffset,
                            '--abs-offset': absOffset,
                            '--flavour-color': item.accentColor || '#CCFF00',
                          }}
                        >
                          <article className="product-card detail-related-card">
                            <div className="product-card__image detail-related-card__image">
                              <img src={item.image} alt={item.title} loading="lazy" />
                            </div>
                            <div className="product-card__body detail-related-card__body">
                              <p className="product-card__category detail-related-card__category">{item.subtitle}</p>
                              <h3 className="product-card__name detail-related-card__name">{item.title}</h3>
                            </div>
                          </article>
                        </Link>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    className="detail-coverflow__nav detail-coverflow__nav--next"
                    onClick={() => setCoverflowIndex((prev) => (prev + 1) % relatedCarouselItems.length)}
                    aria-label="Next flavour"
                  >
                    ›
                  </button>
                </div>
              </>
            ) : (
              <div className="detail-related__viewport">
                <div className="detail-related__track">
                  {relatedCarouselItems.map((item) => (
                    <Link key={item.id} to={`/products/${item.slug}`} className="detail-related__item" style={{ textDecoration: 'none' }}>
                      <article className="product-card">
                        <div className="product-card__image">
                          <img src={item.image} alt={item.title} loading="lazy" />
                          {item.isNew && <span className="product-card__badge">New</span>}
                        </div>
                        <div className="product-card__body">
                          <p className="product-card__category">{item.subtitle}</p>
                          <h3 className="product-card__name">{item.title}</h3>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductDetail
