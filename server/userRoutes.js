/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import express from 'express'
import prisma from './db.js'
import { hashPassword } from './passwords.js'
import { ROLES, hasPermission, publicUser } from './permissions.js'
import { countOtherSuperadmins, readNewUser } from './users.js'

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

export function userRouter() {
  const router = express.Router()
  const json = express.json({ limit: '32kb' })

  router.use((req, res, next) => {
    if (!hasPermission(req.admin.role, 'users')) {
      res.status(403).json({ error: 'You do not have access to this.' })
      return
    }
    next()
  })

  router.get('/', asyncRoute(async (_req, res) => {
    const users = await prisma.adminUser.findMany({ orderBy: [{ role: 'asc' }, { username: 'asc' }] })
    res.json({ items: users.map(publicUser) })
  }))

  router.post('/', json, asyncRoute(async (req, res) => {
    const next = readNewUser(req.body)
    if (next.error) {
      res.status(400).json({ error: next.error })
      return
    }
    try {
      const created = await prisma.adminUser.create({
        data: {
          username: next.username,
          displayName: next.displayName,
          passwordHash: hashPassword(next.password),
          role: next.role,
        },
      })
      res.status(201).json(publicUser(created))
    } catch (error) {
      if (error?.code === 'P2002') {
        res.status(409).json({ error: 'That username is already in use.' })
        return
      }
      throw error
    }
  }))

  router.patch('/:id', json, asyncRoute(async (req, res) => {
    const current = await prisma.adminUser.findUnique({ where: { id: req.params.id } })
    if (!current) {
      res.status(404).json({ error: 'User not found.' })
      return
    }
    const displayName = req.body?.displayName === undefined
      ? current.displayName
      : String(req.body.displayName || '').trim().slice(0, 80)
    const role = req.body?.role === undefined ? current.role : req.body.role
    const active = req.body?.active === undefined ? current.active : Boolean(req.body.active)
    if (!displayName) {
      res.status(400).json({ error: 'Enter a name.' })
      return
    }
    if (!ROLES.includes(role)) {
      res.status(400).json({ error: 'Choose super admin, admin, or staff.' })
      return
    }
    if (req.admin.id === current.id && (!active || role !== current.role)) {
      res.status(400).json({ error: 'You cannot change your own role or turn off your own account.' })
      return
    }
    const losingSuperadmin = current.role === 'superadmin' && current.active && (role !== 'superadmin' || !active)
    if (losingSuperadmin && await countOtherSuperadmins(current.id) === 0) {
      res.status(400).json({ error: 'Keep at least one active super admin.' })
      return
    }
    const data = { displayName, role, active }
    if (req.body?.password) {
      const password = String(req.body.password)
      if (password.length < 8 || password.length > 200) {
        res.status(400).json({ error: 'Password must be at least 8 characters.' })
        return
      }
      data.passwordHash = hashPassword(password)
    }
    const saved = await prisma.adminUser.update({ where: { id: current.id }, data })
    res.json(publicUser(saved))
  }))

  router.delete('/:id', asyncRoute(async (req, res) => {
    if (req.params.id === req.admin.id) {
      res.status(400).json({ error: 'You cannot delete your own account.' })
      return
    }
    const current = await prisma.adminUser.findUnique({ where: { id: req.params.id } })
    if (!current) {
      res.status(404).json({ error: 'User not found.' })
      return
    }
    if (current.role === 'superadmin' && current.active && await countOtherSuperadmins(current.id) === 0) {
      res.status(400).json({ error: 'Keep at least one active super admin.' })
      return
    }
    await prisma.adminUser.delete({ where: { id: current.id } })
    res.json({ ok: true })
  }))

  return router
}
