/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useMemo } from 'react'
import ProductShowcase from '../components/sections/ProductShowcase'
import { useCms } from '../contexts/useCms'

const SHOWCASE_ACCENT_BY_SLUG = {
  'topbar-8000-puffs': '#CCFF00',
  'topbar-40000-puffs': '#00C2FF',
  'topbar-50000-puffs': '#FF6B35',
  'topbar-60000-puffs': '#B48CFF',
}

const REQUIRED_TOPBAR_SLUGS = ['topbar-8000-puffs', 'topbar-40000-puffs', 'topbar-50000-puffs', 'topbar-60000-puffs']

function Products() {
  const { merged } = useCms()
  const home = merged.home || {}
  const featuredProductSlugs = useMemo(
    () => Array.from(new Set([...(home.featuredProductSlugs || []), ...REQUIRED_TOPBAR_SLUGS])),
    [home.featuredProductSlugs],
  )

  const coreProducts = useMemo(
    () => {
      const productsList = merged.products?.items ?? []
      return featuredProductSlugs
        .map((slug) => productsList.find((product) => product.slug === slug))
        .filter(Boolean)
        .map((product) => ({
          slug: product.slug,
          name: product.name,
          tagline: product.category,
          description: product.tagline,
          image: product.image,
          showcaseImagePosition: product.showcaseImagePosition,
          showcaseAccentColor: SHOWCASE_ACCENT_BY_SLUG[product.slug],
          link: `/products/${product.slug}`,
        }))
    },
    [merged.products?.items, featuredProductSlugs],
  )

  return (
    <ProductShowcase
      products={coreProducts}
      title={home.productShowcaseTitle || 'Our Products'}
      limit={coreProducts.length}
      className="showcase-section--core showcase-section--products"
      showViewAll={false}
    />
  )
}

export default Products
