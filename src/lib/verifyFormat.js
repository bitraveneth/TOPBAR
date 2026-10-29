/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export const STATUS_LABELS = {
  genuine_first: 'Genuine',
  already_verified: 'Repeat check',
  over_verified: 'Too many checks',
  not_authentic: 'Not authentic',
  invalid_format: 'Bad format',
  disabled: 'Disabled',
  expired: 'Expired',
}

export function formatCount(value) {
  return new Intl.NumberFormat().format(Number(value) || 0)
}

export function formatWhen(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function toLocalInput(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
