import { Link } from 'react-router-dom'

const colors = ['#CCFF00', '#00FFAA', '#FF6B35']

function ProductShowcase({ products, title = 'Explore Our Products', limit = 3 }) {
  const displayed = products.slice(0, limit)

  return (
    <section className="showcase-section">
      <div className="container">
        <h1 className="section-hero-title">{title}</h1>
        <div className="showcase-grid">
          {displayed.map((product, i) => (
            <Link
              key={product.slug}
              to={`/products/${product.slug}`}
              className="showcase-card"
              style={{
                '--card-accent': colors[i % colors.length],
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div className="showcase-card__glow" />
              <img className="showcase-card__img" src={product.image} alt={product.name} loading="lazy" />
              <div className="showcase-card__overlay" />
              <div className="showcase-card__info">
                <h3 className="showcase-card__name">{product.name}</h3>
                <p className="showcase-card__tagline">{product.tagline}</p>
                <div className="showcase-card__specs">
                  {product.specs?.slice(0, 4).map((spec) => (
                    <span key={spec} className="showcase-card__spec">{spec}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase
