/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import HeroCarousel from '../components/common/HeroCarousel'
import { lazy, Suspense, useMemo } from 'react'

import ProductShowcase from '../components/sections/ProductShowcase'
import BestSellingFlavors from '../components/sections/BestSellingFlavors'
import HomeBrandVideo from '../components/sections/HomeBrandVideo'
import BrandValues from '../components/sections/BrandValues'
const TopbarScrollZoom = lazy(() => import('../components/sections/TopbarScrollZoom'))
const LovedByYou = lazy(() => import('../components/sections/LovedByYou'))
const HomeBlogPreview = lazy(() => import('../components/sections/HomeBlogPreview'))
const NewsletterSignup = lazy(() => import('../components/sections/NewsletterSignup'))

import { useCms } from '../contexts/CmsContext'

function Home() {
  const { merged } = useCms()
  const home = merged.home || {}
  const productsList = merged.products?.items ?? []
  const showcaseAccentBySlug = {
    'topbar-8000-puffs': '#CCFF00',
    'topbar-40000-puffs': '#00C2FF',
    'topbar-50000-puffs': '#FF6B35',
    'topbar-60000-puffs': '#B48CFF',
  }

  const requiredTopbarSlugs = ['topbar-8000-puffs', 'topbar-40000-puffs', 'topbar-50000-puffs', 'topbar-60000-puffs']
  const featuredProductSlugs = Array.from(new Set([...(home.featuredProductSlugs || []), ...requiredTopbarSlugs]))
  const flavorOrderBySlug = home.flavorOrderBySlug || {}

  const coreProducts = useMemo(
    () =>
      featuredProductSlugs
        .map((slug) => productsList.find((product) => product.slug === slug))
        .filter(Boolean)
        .map((product) => ({
          slug: product.slug,
          name: product.name,
          tagline: product.category,
          description: '',
          image: product.image,
          showcaseImagePosition: product.showcaseImagePosition,
          showcaseAccentColor: showcaseAccentBySlug[product.slug],
          link: `/products/${product.slug}`,
        })),
    [productsList, featuredProductSlugs],
  )

  const bestFlavorGroups = useMemo(() => {
    const products = featuredProductSlugs
      .map((slug) => productsList.find((product) => product.slug === slug))
      .filter(Boolean)

    const flavorPool = products.flatMap((product) => {
      const preferredNames = flavorOrderBySlug[product.slug] || []
      const preferredFlavors = preferredNames
        .map((name) => (product.colorVariants || []).find((flavor) => flavor.name === name))
        .filter(Boolean)

      const fallbackFlavors = (product.colorVariants || []).filter(
        (flavor) => !preferredNames.includes(flavor.name),
      )

      return [...preferredFlavors, ...fallbackFlavors]
        .filter((flavor) => flavor?.name && flavor?.image)
        .map((flavor) => ({
          ...flavor,
          slug: product.slug,
          productTitle: product.name,
        }))
    })

    if (!flavorPool.length) return []

    // Shuffle once per data change so cards are mixed across products.
    const shuffled = [...flavorPool].sort(() => Math.random() - 0.5)
    const targetCards = 12
    const filledFlavors = Array.from({ length: targetCards }, (_, idx) => ({
      ...shuffled[idx % shuffled.length],
      _slot: idx,
    }))

    return [
      {
        title: 'Topbar Mix',
        slug: 'products',
        flavors: filledFlavors,
      },
    ]
  }, [productsList, featuredProductSlugs, flavorOrderBySlug])

  const heroSlides = home.heroSlides || []
  const brandVideo = home.brandVideo || {}
  const brandValues = home.brandValues || []
  const topbarTagline = home.topbarTagline

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <ProductShowcase
        products={coreProducts}
        title={home.productShowcaseTitle || 'Our Products'}
        limit={coreProducts.length}
        className="showcase-section--core"
      />
      <BestSellingFlavors groups={bestFlavorGroups} />
      <HomeBrandVideo
        title={brandVideo.title}
        subtitle={brandVideo.subtitle}
        poster={brandVideo.poster}
        mp4={brandVideo.mp4}
        mov={brandVideo.mov}
        stats={brandVideo.stats}
        ctaLabel={brandVideo.ctaLabel}
        ctaLink={brandVideo.ctaLink}
        ctaTagline={brandVideo.ctaTagline}
        fallbackTitle={brandVideo.fallbackTitle}
        fallbackMessage={brandVideo.fallbackMessage}
      />
      <BrandValues values={brandValues} />
      <Suspense fallback={null}>
        <LovedByYou />
        <TopbarScrollZoom tagline={topbarTagline} />
        <HomeBlogPreview />
        <NewsletterSignup />
      </Suspense>
    </>
  )
}

export default Home
