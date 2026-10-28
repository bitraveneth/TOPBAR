/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import crypto from 'node:crypto'

const COOKIE = 'tb_admin_session'
const WEEK_SECONDS = 7 * 24 * 60 * 60

function sessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not set')
  return value
}

function sign(body) {
  return crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url')
}

export function passwordsMatch(input, expected) {
  const left = crypto.createHash('sha256').update(String(input)).digest()
  const right = crypto.createHash('sha256').update(String(expected)).digest()
  return crypto.timingSafeEqual(left, right)
}

function cookieFlags() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `HttpOnly; Path=/; SameSite=Lax${secure}`
}

export function createSessionCookie(username) {
  const body = Buffer.from(JSON.stringify({
    role: 'admin',
    username,
    exp: Date.now() + WEEK_SECONDS * 1000,
  })).toString('base64url')
  const token = `${body}.${sign(body)}`
  return `${COOKIE}=${token}; ${cookieFlags()}; Max-Age=${WEEK_SECONDS}`
}

export function clearSessionCookie() {
  return `${COOKIE}=; ${cookieFlags()}; Max-Age=0`
}

export function readSession(req) {
  const header = req.headers.cookie
  if (!header) return null
  const pair = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))
  if (!pair) return null
  const token = pair.slice(COOKIE.length + 1)
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const body = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  const expected = sign(body)
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (payload.role !== 'admin' || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function requireAdmin(req, res, next) {
  if (!readSession(req)) {
    res.status(401).json({ error: 'Sign in required.' })
    return
  }
  next()
}
