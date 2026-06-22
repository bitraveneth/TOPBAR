/**
 * Responsive image helpers for hero and product grids.
 */

function stripExtension(src) {
  return src.replace(/\.(webp|png|jpe?g)$/i, '')
}

function extension(src) {
  const match = src.match(/\.(webp|png|jpe?g)$/i)
  return match ? match[0] : '.webp'
}

/** @param {string} src */
export function heroImageProps(src) {
  if (!src) return {}
  const ext = extension(src)
  const base = stripExtension(src)
  return {
    src: `${base}-960w${ext}`,
    srcSet: `${base}-480w${ext} 480w, ${base}-960w${ext} 960w, ${src} 1920w`,
    sizes: '(max-width: 768px) 100vw, 100vw',
  }
}

/** Flavor / small product tiles in a 2–4 column grid. */
export function cardImageProps(src) {
  if (!src) return {}
  const ext = extension(src)
  const base = stripExtension(src)
  return {
    src: `${base}-480w${ext}`,
    srcSet: `${base}-480w${ext} 480w, ${base}-960w${ext} 960w, ${src} 1280w`,
    sizes: '(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 300px',
  }
}

/** Product detail hero — single large image. */
export function productDetailImageProps(src) {
  if (!src) return {}
  const ext = extension(src)
  const base = stripExtension(src)
  return {
    src: `${base}-960w${ext}`,
    srcSet: `${base}-480w${ext} 480w, ${base}-960w${ext} 960w, ${src} 1600w`,
    sizes: '(max-width: 768px) 92vw, 560px',
  }
}

/** Default LCP image per product slug (first flavour variant). */
export const PRODUCT_LCP_PRELOAD = {
  'topbar-40000-puffs': '/images/products/topbar-40000-colors/watermelon-ice.webp',
  'topbar-8000-puffs': '/images/products/topbar-8000-colors-v1/cherry-peach.png',
  'topbar-50000-puffs': '/images/products/topbar-50000-colors/mint-ice.png',
  'topbar-60000-puffs': '/images/products/topbar-60000-colors/lime-ice.png',
}
