import { productDetailImageProps } from './responsiveImage'

function upsertPreloadLink(id, href) {
  if (!href) return
  let link = document.querySelector(`link[data-preload-id="${id}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.setAttribute('data-preload-id', id)
    document.head.appendChild(link)
  }
  if (link.getAttribute('href') === href) return
  link.href = href
  if (href.endsWith('.webp')) link.type = 'image/webp'
  else link.removeAttribute('type')
  link.fetchPriority = 'high'
}

export function preloadProductImage(slug, imageSrc) {
  const { src } = productDetailImageProps(imageSrc)
  upsertPreloadLink(`product-${slug}`, src || imageSrc)
}

export function clearProductImagePreload(slug) {
  document.querySelector(`link[data-preload-id="product-${slug}"]`)?.remove()
}
