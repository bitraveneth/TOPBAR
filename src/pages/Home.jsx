import HeroCarousel from '../components/common/HeroCarousel'
import { useMemo } from 'react'

import ProductShowcase from '../components/sections/ProductShowcase'
import BestSellingFlavors from '../components/sections/BestSellingFlavors'
import BrandValues from '../components/sections/BrandValues'
import TopbarScrollZoom from '../components/sections/TopbarScrollZoom'

import LovedByYou from '../components/sections/LovedByYou'
import HomeBlogPreview from '../components/sections/HomeBlogPreview'
import NewsletterSignup from '../components/sections/NewsletterSignup'

import { useCms } from '../contexts/CmsContext'

function Home() {
  const { merged } = useCms()
  const home = merged.home || {}
  const productsList = merged.products?.items ?? []

  const featuredProductSlugs = home.featuredProductSlugs || ['topbar-9900-puffs', 'topbar-8000-puffs']
  const flavorOrderBySlug = home.flavorOrderBySlug || {}

  const coreProducts = useMemo(
    () =>
      productsList
        .filter((product) => featuredProductSlugs.includes(product.slug))
        .map((product) => ({
          slug: product.slug,
          name: product.name,
          tagline: product.category,
          description: '',
          image: product.image,
          showcaseImagePosition: product.showcaseImagePosition,
          link: `/products/${product.slug}`,
        })),
    [productsList, featuredProductSlugs],
  )

  const bestFlavorGroups = useMemo(() => {
    return featuredProductSlugs
      .map((slug) => productsList.find((product) => product.slug === slug))
      .filter(Boolean)
      .map((product) => {
        const preferredNames = flavorOrderBySlug[product.slug] || []
        const preferredFlavors = preferredNames
          .map((name) => (product.colorVariants || []).find((flavor) => flavor.name === name))
          .filter(Boolean)

        const fallbackFlavors = (product.colorVariants || []).filter(
          (flavor) => !preferredNames.includes(flavor.name),
        )

        return {
          title: product.name,
          slug: product.slug,
          flavors: [...preferredFlavors, ...fallbackFlavors].slice(0, 4),
        }
      })
      .filter((group) => group.flavors.length > 0)
  }, [productsList, featuredProductSlugs, flavorOrderBySlug])

  const heroSlides = home.heroSlides || []
  const brandValues = home.brandValues || []
  const topbarTagline = home.topbarTagline

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <ProductShowcase
        products={coreProducts}
        title={home.productShowcaseTitle || 'Our Products'}
        limit={2}
        className="showcase-section--core"
      />
      <BestSellingFlavors groups={bestFlavorGroups} />
      <BrandValues values={brandValues} />
      <LovedByYou />
      <TopbarScrollZoom tagline={topbarTagline} />
      <HomeBlogPreview />
      <NewsletterSignup />
    </>
  )
}

export default Home
