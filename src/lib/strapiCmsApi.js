function getStrapiBaseUrl() {
  return (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '')
}

async function fetchStrapi(path) {
  const res = await fetch(`${getStrapiBaseUrl()}${path}`)
  if (!res.ok) throw new Error(`Strapi request failed: ${res.status} ${path}`)
  return res.json()
}

function attrs(node) {
  if (!node) return {}
  return node.attributes || node
}

function pickArray(value) {
  return Array.isArray(value) ? value : []
}

function mapNavigation(navData) {
  const nav = attrs(navData)
  const menuItems = pickArray(nav.menuItems)
  const primaryNav = menuItems.map((item) => ({
    label: item.label || '',
    path: item.path || '',
    children: (item.children || []).map((group) => ({
      title: group.title || '',
      links: (group.links || []).map((link) => ({
        label: link.label || '',
        path: link.path || '',
      })),
    })),
  }))
  return { primaryNav }
}

function mapHomepage(homeData) {
  const home = attrs(homeData)
  const heroSlides = pickArray(home.heroSlidesEditor)
  const featuredProducts = pickArray(home.featuredProductsEditor)
  const categories = pickArray(home.categoriesEditor)
  const trending = pickArray(home.trendingEditor)
  const brandValues = pickArray(home.brandValuesEditor)
  const testimonials = pickArray(home.testimonialsEditor)

  return {
    heroSlides,
    featuredProducts,
    categories,
    trending,
    brandValues,
    testimonials,
    topbarTagline: home.topbarTagline || '',
    lovedByYou: home.lovedByYou || null,
    blogPreview: home.homeBlogPreview || null,
    newsletter: home.newsletter || null,
  }
}

function mapFooter(footerData) {
  const footer = attrs(footerData)
  return {
    columns: pickArray(footer.columns),
    legalLinks: pickArray(footer.legalLinks),
    copyright: footer.copyright || '',
    giantWordmark: footer.giantWordmark || '',
  }
}

function mapSite(siteData) {
  const site = attrs(siteData)
  return site.settings || {}
}

function mapProducts(productsPayload) {
  const rows = Array.isArray(productsPayload?.data) ? productsPayload.data : []
  const items = rows.map((row) => {
    const p = attrs(row)
    const specsFromEditor = pickArray(p.specItems).map((x) => x.label).filter(Boolean)
    return {
      ...p,
      specs: specsFromEditor,
      features: pickArray(p.featuresEditor),
      featureShowcase: pickArray(p.featureShowcaseEditor),
      colorVariants: pickArray(p.colorVariantsEditor),
    }
  })
  return { items }
}

export async function fetchStrapiCmsMap() {
  const [navigationRes, homepageRes, footerRes, siteRes, productsRes] = await Promise.all([
    fetchStrapi('/api/navigation'),
    fetchStrapi('/api/homepage'),
    fetchStrapi('/api/footer'),
    fetchStrapi('/api/site-setting'),
    fetchStrapi('/api/products?pagination[pageSize]=200'),
  ])

  return {
    site: mapSite(siteRes?.data),
    navigation: mapNavigation(navigationRes?.data),
    home: mapHomepage(homepageRes?.data),
    footer: mapFooter(footerRes?.data),
    products: mapProducts(productsRes),
    newsletter: attrs(homepageRes?.data).newsletter || {},
  }
}
