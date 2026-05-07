/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.isNew && <span className="product-card__badge">New</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.tagline || product.description}</p>
        {product.specs && (
          <div className="product-card__specs">
            {product.specs.slice(0, 3).map((spec) => (
              <span key={spec} className="spec-tag">{spec}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default ProductCard
