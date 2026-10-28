/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export function clientIp(req) {
  const remote = String(req.socket?.remoteAddress || '')
  const normalized = remote.replace(/^::ffff:/, '')
  const loopback = normalized === '127.0.0.1' || normalized === '::1'
  if (loopback) {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded.trim()) {
      return forwarded.split(',')[0].trim().replace(/^::ffff:/, '') || normalized || 'unknown'
    }
  }
  return normalized || 'unknown'
}
