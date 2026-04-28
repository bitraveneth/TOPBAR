import { useMemo } from 'react'
import ProductShowcase from '../components/sections/ProductShowcase'
import { useCms } from '../contexts/CmsContext'

function Products() {
  const { merged } = useCms()
  const home = merged.home || {}
  const productsList = merged.products?.items ?? []
  const featuredProductSlugs = home.featuredProductSlugs || ['topbar-9900-puffs', 'topbar-8000-puffs']

  const coreProducts = useMemo(
    () =>
      featuredProductSlugs
        .map((slug) => productsList.find((product) => product.slug === slug))
        .filter(Boolean)
        .map((product) => ({
          slug: product.slug,
          name: product.name,
          tagline: product.category,
          description: product.tagline,
          image: product.image,
          showcaseImagePosition: product.showcaseImagePosition,
          link: `/products/${product.slug}`,
        })),
    [productsList, featuredProductSlugs],
  )

  return (
    <ProductShowcase
      products={coreProducts}
      title={home.productShowcaseTitle || 'Our Products'}
      limit={2}
      className="showcase-section--core showcase-section--products"
      showViewAll={false}
    />
  )
}

export default Products
