/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useDocument } from './cms/useDocument'

export default function ProductsAdmin() {
  const { data, error, status } = useDocument('products')
  const items = data?.items || []

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Products</h1>
          <p>Add a product, change its photo, or attach a video. The public catalog updates after you save.</p>
        </div>
        <Link className="admin-btn" to="/admin/products/new"><Plus size={15} /> New product</Link>
      </header>
      {error ? <p className="admin-error">{error}</p> : null}
      {status === 'loading' ? <p className="admin-note">Loading products…</p> : null}
      <div className="product-grid">
        {items.map((product) => (
          <Link key={product.slug} className="product-tile" to={`/admin/products/${product.slug}`}>
            {product.image ? <img src={product.image} alt="" /> : <span className="product-tile__empty">No image</span>}
            <strong>{product.name}</strong>
            <span>{product.category || 'Uncategorized'}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
