/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import crypto from 'node:crypto'
import prisma from './db.js'
import { ROLES } from './permissions.js'

const COOKIE = 'tb_admin_session'
const MONTH_SECONDS = 30 * 24 * 60 * 60
const SESSION_SECONDS = 12 * 60 * 60

function sessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value) throw new Error('ADMIN_SESSION_SECRET is not set')
  return value
}

function sign(body) {
  return crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url')
}

function cookieFlags() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `HttpOnly; Path=/; SameSite=Lax${secure}`
}

export function createSessionCookie(user, remember) {
  const seconds = remember ? MONTH_SECONDS : SESSION_SECONDS
  const body = Buffer.from(JSON.stringify({
    sub: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + seconds * 1000,
  })).toString('base64url')
  const token = `${body}.${sign(body)}`
  const persistent = remember ? `; Max-Age=${seconds}` : ''
  return `${COOKIE}=${token}; ${cookieFlags()}${persistent}`
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
    if (!ROLES.includes(payload.role) || typeof payload.sub !== 'string') return null
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function loadAdmin(req) {
  const session = readSession(req)
  if (!session) return null
  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } })
  if (!user || !user.active) return null
  return user
}
