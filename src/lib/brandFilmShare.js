/**
 * TOPBAR brand film — share link builders for social platforms.
 */

export const BRAND_MOTION_HASH = '#brand-motion'

export const DEFAULT_SHARE_TITLE = 'TOPBAR in Motion'

export const DEFAULT_SHARE_TEXT =
  'Watch the TOPBAR brand film — premium design and the full device lineup.'

export function getPageShareUrl(path = '') {
  if (typeof window === 'undefined') return ''
  const base = window.location.origin
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function getBrandFilmShareUrl() {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${window.location.pathname}${BRAND_MOTION_HASH}`
}

export function getProductShareUrl(slug, { flavor } = {}) {
  const base = getPageShareUrl(`/products/${slug}`)
  if (!flavor) return base
  const params = new URLSearchParams({ flavor })
  return `${base}?${params.toString()}`
}

function enc(value) {
  return encodeURIComponent(value)
}

/**
 * @typedef {'window' | 'copy' | 'native'} ShareChannelAction
 * @typedef {{
 *   id: string
 *   label: string
 *   accent: string
 *   icon: string
 *   action: ShareChannelAction
 *   hint?: string
 *   getUrl?: (ctx: { url: string, title: string, text: string }) => string
 * }} ShareChannel
 */

/** @type {ShareChannel[]} */
export const SHARE_CHANNELS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    accent: '#25D366',
    icon: 'whatsapp',
    action: 'window',
    getUrl: ({ url, text }) => `https://wa.me/?text=${enc(`${text} ${url}`)}`,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    accent: '#1877F2',
    icon: 'facebook',
    action: 'window',
    getUrl: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    accent: '#26A5E4',
    icon: 'telegram',
    action: 'window',
    getUrl: ({ url, text }) =>
      `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`,
  },
  {
    id: 'x',
    label: 'X',
    accent: '#0f0f0f',
    icon: 'x',
    action: 'window',
    getUrl: ({ url, text }) =>
      `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    accent: '#0A66C2',
    icon: 'linkedin',
    action: 'window',
    getUrl: ({ url }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
  },
  {
    id: 'messenger',
    label: 'Messenger',
    accent: '#0084FF',
    icon: 'messenger',
    action: 'window',
    getUrl: ({ url }) =>
      `https://www.facebook.com/dialog/send?link=${enc(url)}&redirect_uri=${enc(url)}`,
  },
  {
    id: 'email',
    label: 'Email',
    accent: '#6b7280',
    icon: 'email',
    action: 'window',
    getUrl: ({ url, title, text }) =>
      `mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}`,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    accent: '#E4405F',
    icon: 'instagram',
    action: 'copy',
    hint: 'Link copied — paste in Story, DM, or bio',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    accent: '#010101',
    icon: 'tiktok',
    action: 'copy',
    hint: 'Link copied — paste in TikTok caption or bio',
  },
  {
    id: 'copy',
    label: 'Copy link',
    accent: 'var(--accent)',
    icon: 'link',
    action: 'copy',
    hint: 'Link copied',
  },
]

export function openShareChannel(channel, ctx) {
  if (channel.action === 'copy') {
    return { type: 'copy', hint: channel.hint || 'Link copied' }
  }

  if (channel.action === 'native') {
    return { type: 'native' }
  }

  const href = channel.getUrl?.(ctx)
  if (!href) return { type: 'error' }

  window.open(href, '_blank', 'noopener,noreferrer,width=600,height=520')
  return { type: 'opened', label: channel.label }
}

export async function copyShareLink(url) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return true
  }

  const input = document.createElement('textarea')
  input.value = url
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.left = '-9999px'
  document.body.appendChild(input)
  input.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(input)
  return ok
}

export function canUseNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

/** @deprecated Use copyShareLink */
export const copyBrandFilmLink = copyShareLink
