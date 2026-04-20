import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import products from '../data/products.json'
import ProductCard from '../components/common/ProductCard'

function Products() {
  const [searchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') || 'All'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCat)

  const categories = ['All', ...new Set(products.map((p) => p.category))]

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catMatch = category === 'All' || p.category === category
      const qMatch = p.name.toLowerCase().includes(query.toLowerCase())
      return catMatch && qMatch
    })
  }, [category, query])

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>All Products</h1>
          <p>Browse our complete catalog of devices, pods, tanks, and accessories.</p>
        </div>
      </div>

      <div className="container section">
        <div className="filters">
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="search-input"
              style={{ paddingLeft: '2.2rem', width: '100%' }}
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn${category === cat ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No products found matching your criteria.
          </p>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <Link key={product.slug} to={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Products
