import { useMemo } from 'react'
import ProductShowcase from '../components/sections/ProductShowcase'
import products from '../data/products.json'

function Products() {
  const coreProducts = useMemo(
    () =>
      ['topbar-9900-puffs', 'topbar-8000-puffs']
        .map((slug) => products.find((product) => product.slug === slug))
        .filter(Boolean)
        .map((product) => ({
          slug: product.slug,
          name: product.name,
          tagline: product.category,
          description: product.tagline,
          image: product.image,
          link: `/products/${product.slug}`,
        })),
    []
  )

  return (
    <ProductShowcase
      products={coreProducts}
      title="Our Products"
      limit={2}
      className="showcase-section--core showcase-section--products"
      showViewAll={false}
    />
  )
}

export default Products
