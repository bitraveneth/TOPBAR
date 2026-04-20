import HeroCarousel from '../components/common/HeroCarousel'

import ProductShowcase from '../components/sections/ProductShowcase'
import FunkyBanner from '../components/sections/FunkyBanner'
import BrandValues from '../components/sections/BrandValues'

import LovedByYou from '../components/sections/LovedByYou'

import products from '../data/products.json'
import homeSections from '../data/homeSections.json'

function Home() {
  return (
    <>
      <HeroCarousel slides={homeSections.heroSlides} />
      <ProductShowcase
        products={products}
        title="Explore Our Products"
        limit={3}
      />
      <BrandValues values={homeSections.brandValues} />
      <LovedByYou />
      <FunkyBanner />
    </>
  )
}

export default Home
