/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import prisma from './db.js'
import { hashPassword, verifyPassword } from './passwords.js'
import { ROLES } from './permissions.js'

const DUMMY_HASH = hashPassword('not-a-real-password')

export function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase()
}

export async function ensureSuperadmin() {
  const username = normalizeUsername(process.env.ADMIN_USERNAME)
  const password = String(process.env.ADMIN_PASSWORD || '')
  if (!username || !password) throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD are required.')
  const existing = await prisma.adminUser.findUnique({ where: { username } })
  if (existing) return existing
  return prisma.adminUser.create({
    data: {
      username,
      displayName: 'Super admin',
      passwordHash: hashPassword(password),
      role: 'superadmin',
    },
  })
}

export async function authenticate(username, password) {
  const user = await prisma.adminUser.findUnique({ where: { username: normalizeUsername(username) } })
  const ok = verifyPassword(password, user?.passwordHash || DUMMY_HASH)
  if (!user || !user.active || !ok) return null
  return user
}

function cleanName(value) {
  return String(value || '').trim().slice(0, 80)
}

function cleanPassword(value) {
  const password = String(value || '')
  if (password.length < 8 || password.length > 200) return ''
  return password
}

export function readNewUser(body) {
  const username = normalizeUsername(body?.username)
  const displayName = cleanName(body?.displayName)
  const password = cleanPassword(body?.password)
  const role = ROLES.includes(body?.role) ? body.role : ''
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) return { error: 'Username must be 3–32 letters, numbers, dots, or dashes.' }
  if (!displayName) return { error: 'Enter a name.' }
  if (!password) return { error: 'Password must be at least 8 characters.' }
  if (!role) return { error: 'Choose super admin, admin, or staff.' }
  return { username, displayName, password, role }
}

export async function countOtherSuperadmins(exceptId) {
  return prisma.adminUser.count({
    where: {
      role: 'superadmin',
      active: true,
      NOT: { id: exceptId },
    },
  })
}
