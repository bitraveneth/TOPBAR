import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import products from '../data/products.json'

function ProductDetail() {
  const { slug } = useParams()
  const product = products.find((p) => p.slug === slug)

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
    <div className="container section">
      <div className="detail-layout">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="detail-specs">
            <h3>Key Specifications</h3>
            <ul>
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            <Link to="/products" className="btn-primary">Buy Now</Link>
            <Link to="/products" className="btn-outline">Compare</Link>
          </div>

          <Link className="back-link" to="/products">
            <ArrowLeft size={16} />
            Back to all products
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Related Products</h3>
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
  )
}

export default ProductDetail
