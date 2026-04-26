import HeroCarousel from '../components/common/HeroCarousel'
import { useMemo } from 'react'

import ProductShowcase from '../components/sections/ProductShowcase'
import BestSellingFlavors from '../components/sections/BestSellingFlavors'
import BrandValues from '../components/sections/BrandValues'
import TopbarScrollZoom from '../components/sections/TopbarScrollZoom'

import LovedByYou from '../components/sections/LovedByYou'
import HomeBlogPreview from '../components/sections/HomeBlogPreview'

import homeSections from '../data/homeSections.json'
import products from '../data/products.json'

function Home() {
  const featuredProductSlugs = ['topbar-9900-puffs', 'topbar-8000-puffs']

  const coreProducts = useMemo(
    () =>
      products
        .filter((product) => featuredProductSlugs.includes(product.slug))
        .map((product) => ({
          slug: product.slug,
          name: product.name,
          tagline: product.category,
          description: '',
          image: product.image,
          link: `/products/${product.slug}`,
        })),
    []
  )

  const bestFlavorGroups = useMemo(
    () => {
      const flavorOrderBySlug = {
        'topbar-9900-puffs': ['Mango', 'Coke Ice', 'Berry Grape', 'Strawberry Ice'],
        'topbar-8000-puffs': ['Mango', 'Coke Ice', 'Watermelon Ice', 'Passion Fruit'],
      }

      return featuredProductSlugs
        .map((slug) => products.find((product) => product.slug === slug))
        .filter(Boolean)
        .map((product) => {
          const preferredNames = flavorOrderBySlug[product.slug] || []
          const preferredFlavors = preferredNames
            .map((name) => (product.colorVariants || []).find((flavor) => flavor.name === name))
            .filter(Boolean)

          const fallbackFlavors = (product.colorVariants || []).filter(
            (flavor) => !preferredNames.includes(flavor.name)
          )

          return {
            title: product.name,
            slug: product.slug,
            flavors: [...preferredFlavors, ...fallbackFlavors].slice(0, 4),
          }
        })
        .filter((group) => group.flavors.length > 0)
    },
    []
  )

  return (
    <>
      <HeroCarousel slides={homeSections.heroSlides} />
      <ProductShowcase
        products={coreProducts}
        title="Our Products"
        limit={2}
        className="showcase-section--core"
      />
      <BestSellingFlavors groups={bestFlavorGroups} />
      <BrandValues values={homeSections.brandValues} />
      <LovedByYou />
      <TopbarScrollZoom tagline={homeSections.topbarTagline} />
      <HomeBlogPreview />
    </>
  )
}

export default Home
