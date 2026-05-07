/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'

const colors = ['#CCFF00', '#00C2FF', '#FF6B35', '#B48CFF']

function ProductShowcase({
  products,
  title = 'Explore Our Products',
  limit = 3,
  className = '',
  showViewAll = true,
  ctaText = 'View All Products',
  ctaLink = '/products',
}) {
  const displayed = products.slice(0, limit)
  const sectionClassName = ['showcase-section', className].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName}>
      <div className="container">
        <h1 className="section-hero-title">{title}</h1>
        <div className="showcase-grid">
          {displayed.map((product, i) => (
            <Link
              key={product.slug || product.name}
              to={product.link || `/products/${product.slug}`}
              className="showcase-card"
              style={{
                '--card-accent': product.showcaseAccentColor || colors[i % colors.length],
                animationDelay: `${i * 0.15}s`,
                ...(product.showcaseImagePosition
                  ? { '--showcase-img-pos': product.showcaseImagePosition }
                  : {}),
              }}
            >
              <div className="showcase-card__glow" />
              <img
                className="showcase-card__img"
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
              />
              <div className="showcase-card__overlay" />
              <div className="showcase-card__info">
                {product.tagline && <span className="showcase-card__tag">{product.tagline}</span>}
                <h3 className="showcase-card__name">{product.name}</h3>
                {product.description && <p className="showcase-card__desc">{product.description}</p>}
              </div>
            </Link>
          ))}
        </div>
        {showViewAll && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to={ctaLink} className="btn-outline">{ctaText}</Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductShowcase
