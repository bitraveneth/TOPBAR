/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useDocument } from './cms/useDocument'

function FlavorChips({ flavors }) {
  const shown = flavors.slice(0, 5)
  const extra = flavors.length - shown.length
  if (!flavors.length) return <span className="flavor-chip flavor-chip--empty">No flavors yet</span>
  return (
    <>
      {shown.map((flavor) => (
        <span key={flavor.name} className="flavor-chip">
          <i style={{ background: flavor.hex || '#CCFF00' }} />
          {flavor.name}
        </span>
      ))}
      {extra > 0 ? <span className="flavor-chip">+{extra}</span> : null}
    </>
  )
}

export default function ProductsAdmin() {
  const { data, error } = useDocument('products')
  const items = data?.items || []

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Products</h1>
          <p>Each product can have many flavors. The flavors already on the site are listed here. Open a product to edit them or add a new one. Product images must be under 1 MB.</p>
        </div>
        <Link className="admin-btn" to="/admin/products/new"><Plus size={15} /> New product</Link>
      </header>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="product-list">
        {items.map((product) => {
          const flavors = product.colorVariants || []
          return (
            <Link key={product.slug} className="product-row" to={`/admin/products/${product.slug}`}>
              {product.image ? <img src={product.image} alt="" /> : <span className="media-thumb media-thumb--empty">None</span>}
              <span className="product-row__copy">
                <strong>{product.name}</strong>
                <span>{product.category || 'Uncategorized'} · {flavors.length} flavor{flavors.length === 1 ? '' : 's'}</span>
                <span className="flavor-chips"><FlavorChips flavors={flavors} /></span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
