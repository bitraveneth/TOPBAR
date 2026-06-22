/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import HeroCarousel from '../components/common/HeroCarousel'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import ProductShowcase from '../components/sections/ProductShowcase'
import BestSellingFlavors from '../components/sections/BestSellingFlavors'
import HomeBrandVideo from '../components/sections/HomeBrandVideo'
import BrandValues from '../components/sections/BrandValues'
const TopbarScrollZoom = lazy(() => import('../components/sections/TopbarScrollZoom'))
const LovedByYou = lazy(() => import('../components/sections/LovedByYou'))
const HomeBlogPreview = lazy(() => import('../components/sections/HomeBlogPreview'))
const NewsletterSignup = lazy(() => import('../components/sections/NewsletterSignup'))

import { useCms } from '../contexts/useCms'
import { buildFlavorShuffleSeed, seededShuffle } from '../lib/shuffleFlavors'

const DESKTOP_TOPBAR_ZOOM_MQ = '(min-width: 769px)'

const SHOWCASE_ACCENT_BY_SLUG = {
  'topbar-8000-puffs': '#CCFF00',
  'topbar-40000-puffs': '#00C2FF',
  'topbar-50000-puffs': '#FF6B35',
  'topbar-60000-puffs': '#B48CFF',
}

const REQUIRED_TOPBAR_SLUGS = ['topbar-8000-puffs', 'topbar-40000-puffs', 'topbar-50000-puffs', 'topbar-60000-puffs']

function Home() {
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
          description: '',
          image: product.image,
          showcaseImagePosition: product.showcaseImagePosition,
          showcaseAccentColor: SHOWCASE_ACCENT_BY_SLUG[product.slug],
          link: `/products/${product.slug}`,
        }))
    },
    [merged.products?.items, featuredProductSlugs],
  )

  const bestFlavorGroups = useMemo(() => {
    const productsList = merged.products?.items ?? []
    const flavorOrderBySlug = home.flavorOrderBySlug || {}
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

    const shuffleSeed = buildFlavorShuffleSeed(featuredProductSlugs, flavorOrderBySlug)
    const shuffled = seededShuffle(flavorPool, shuffleSeed)
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
  }, [merged.products?.items, featuredProductSlugs, home.flavorOrderBySlug])

  const heroSlides = home.heroSlides || []
  const brandVideo = home.brandVideo || {}
  const brandValues = home.brandValues || []
  const topbarTagline = home.topbarTagline
  const [showTopbarZoom, setShowTopbarZoom] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_TOPBAR_ZOOM_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_TOPBAR_ZOOM_MQ)
    const sync = () => setShowTopbarZoom(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

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
        films={brandVideo.films}
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
        {showTopbarZoom ? <TopbarScrollZoom tagline={topbarTagline} /> : null}
        <HomeBlogPreview />
        <NewsletterSignup />
      </Suspense>
    </>
  )
}

export default Home
