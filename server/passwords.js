/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import crypto from 'node:crypto'

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('base64url')
  const hash = crypto.scryptSync(String(password), salt, 32).toString('base64url')
  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  const salt = parts[1]
  const expected = Buffer.from(parts[2], 'base64url')
  const actual = crypto.scryptSync(String(password), salt, 32)
  if (actual.length !== expected.length) return false
  return crypto.timingSafeEqual(actual, expected)
}
