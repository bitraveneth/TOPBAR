/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import homeSections from '../data/homeSections.json'
import navigation from '../data/navigation.json'
import products from '../data/products.json'
import lovedByYou from '../data/lovedByYou.json'
import homeBlogPreview from '../data/homeBlogPreview.json'

export const CMS_DOCUMENT_KEYS = [
  { key: 'site', label: 'Site — notice bar, logo' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'home', label: 'Home' },
  { key: 'footer', label: 'Footer' },
  { key: 'products', label: 'Products' },
  { key: 'newsletter', label: 'Newsletter' },
]

export function getDefaultCmsMap() {
  return {
    site: {
      warningBold: 'WARNING:',
      warningText:
        ' This product contains nicotine. Nicotine is an addictive chemical.',
      headerLogo: '/images/topbar-logo.png',
      headerLogoAlt: 'TOPBAR',
    },
    navigation,
    home: {
      ...homeSections,
      productShowcaseTitle: 'Our Products',
      featuredProductSlugs: ['topbar-8000-puffs', 'topbar-40000-puffs', 'topbar-50000-puffs', 'topbar-60000-puffs'],
      flavorOrderBySlug: {
        'topbar-40000-puffs': ['Watermelon Ice', 'Berry Grape', 'Coke Ice', 'Gummy Bear', 'Strawberry Ice', 'Red Energy'],
        'topbar-8000-puffs': ['Watermelon Kiwi', 'Coke Ice', 'Watermelon Ice', 'Grape Ice', 'Passion Fruit'],
        'topbar-50000-puffs': ['Mint Ice', 'Grape Ice', 'Strawberry Kiwi', 'Watermelon Ice'],
        'topbar-60000-puffs': ['Blue Device'],
      },
      lovedByYou,
      blogPreview: homeBlogPreview,
    },
    footer: {
      columns: [
        {
          title: 'Products',
          links: [
            { label: 'TOPBAR 8000 Puffs', path: '/products/topbar-8000-puffs' },
            { label: 'TOPBAR 40000 Puffs', path: '/products/topbar-40000-puffs' },
            { label: 'All Products', path: '/products' },
          ],
        },
        {
          title: 'About Us',
          links: [
            { label: 'Our Brand', path: '/about' },
            { label: 'Exhibition', path: '/exhibition' },
            { label: 'Downloads', path: '/downloads' },
            { label: 'Join Us', path: '/about' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Support', path: '/support' },
            { label: 'Verify Products', path: '/verify-products' },
            { label: 'Downloads', path: '/downloads' },
          ],
        },
      ],
      copyright: '© 2026 TOPBAR. All Rights Reserved.',
      legalLinks: [
        { label: 'Privacy Policy', path: '/compliance' },
        { label: 'Terms of Use', path: '/compliance' },
        { label: 'Cookie Policy', path: '/compliance' },
      ],
      giantWordmark: 'TOP BAR',
    },
    products: {
      items: products,
      slugAliases: {
        'topbar-9900-puffs': 'topbar-40000-puffs',
        'aegis-legend-5': 'topbar-40000-puffs',
        'topbar-mango': 'topbar-40000-puffs',
      },
    },
    newsletter: {
      title: 'Taste the next drop first.',
      emailLabel: 'Email',
      placeholder: 'you@example.com',
      buttonJoin: 'Join Drop List',
      buttonJoined: 'Joined',
    },
  }
}
