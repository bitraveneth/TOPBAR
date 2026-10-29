/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import express from 'express'
import { Prisma } from '@prisma/client'
import prisma from './db.js'
import { clearSessionCookie, createSessionCookie, loadAdmin } from './auth.js'
import { publicUser } from './permissions.js'
import { authenticate } from './users.js'
import { cmsRouter } from './cms.js'
import { userRouter } from './userRoutes.js'
import { parseVerificationInput } from './parseCode.js'
import { commitImport, previewImport } from './importService.js'
import { clientIp } from './request.js'

const STATUSES = new Set([
  'genuine_first',
  'already_verified',
  'over_verified',
  'not_authentic',
  'invalid_format',
  'disabled',
  'expired',
])

const loginFailures = new Map()

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

function pageParams(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(query.pageSize, 10) || 25))
  return { page, pageSize }
}

function recentFailures(ip) {
  const now = Date.now()
  const hits = (loginFailures.get(ip) || []).filter((time) => now - time < 10 * 60 * 1000)
  loginFailures.set(ip, hits)
  return hits
}

function suspicious(code, distinctIps) {
  return code.verificationCount >= 5 || distinctIps >= 3
}

function listItem(code, distinctIps) {
  const last = code.attempts?.[0]
  return {
    id: code.id,
    code: code.code,
    serial: code.serial,
    token: code.token,
    isValid: code.isValid,
    expiresAt: code.expiresAt,
    firstVerifiedAt: code.firstVerifiedAt,
    verificationCount: code.verificationCount,
    attemptCount: code.attemptCount,
    batchLabel: code.batchLabel,
    createdAt: code.createdAt,
    lastAttemptAt: last?.createdAt || null,
    lastStatus: last?.status || null,
    distinctIps,
    suspicious: suspicious(code, distinctIps),
  }
}

async function distinctIpMap(codeIds) {
  const counts = new Map()
  if (!codeIds.length) return counts
  const pairs = await prisma.verificationAttempt.groupBy({
    by: ['codeId', 'ipHash'],
    where: { codeId: { in: codeIds }, NOT: { ipHash: null } },
  })
  for (const pair of pairs) counts.set(pair.codeId, (counts.get(pair.codeId) || 0) + 1)
  return counts
}

function codeWhere(q) {
  const term = String(q || '').trim()
  if (!term) return {}
  return {
    OR: [
      { code: { contains: term, mode: 'insensitive' } },
      { serial: { contains: term, mode: 'insensitive' } },
      { token: { contains: term, mode: 'insensitive' } },
      { batchLabel: { contains: term, mode: 'insensitive' } },
    ],
  }
}

function readExpiry(value, res) {
  if (!value) return { ok: true, value: null }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    res.status(400).json({ error: 'Expiry date is not valid.' })
    return { ok: false }
  }
  return { ok: true, value: date }
}

function activityFilterSql({ status, q }) {
  const parts = []
  if (status) parts.push(Prisma.sql`status = ${status}`)
  if (q) {
    const like = `%${q}%`
    parts.push(Prisma.sql`(
      input ILIKE ${like}
      OR EXISTS (
        SELECT 1 FROM "VerificationCode" c
        WHERE c.id = "VerificationAttempt"."codeId"
          AND (
            c.code ILIKE ${like}
            OR COALESCE(c.serial, '') ILIKE ${like}
            OR COALESCE(c."batchLabel", '') ILIKE ${like}
          )
      )
    )`)
  }
  if (!parts.length) return Prisma.sql`TRUE`
  return Prisma.join(parts, ' AND ')
}

function presentActivityGroup(group, code) {
  const checks = Number(group.checks || 0)
  const distinctIps = Number(group.distinctIps || 0)
  return {
    key: group.groupKey,
    codeId: group.codeId || null,
    input: group.input,
    checks,
    distinctIps,
    latestStatus: group.latestStatus,
    latestAt: group.latestAt,
    firstAt: group.firstAt,
    suspicious: code ? suspicious(code, distinctIps) : checks >= 5 || distinctIps >= 3,
    code: code ? {
      id: code.id,
      code: code.code,
      serial: code.serial,
      verificationCount: code.verificationCount,
      attemptCount: code.attemptCount,
      batchLabel: code.batchLabel,
      isValid: code.isValid,
    } : null,
  }
}

export function adminRouter() {
  const router = express.Router()
  const json = express.json({ limit: '32kb' })
  const bigJson = express.json({ limit: '32mb' })

  router.post('/login', json, asyncRoute(async (req, res) => {
    const ip = clientIp(req)
    const failures = recentFailures(ip)
    if (failures.length >= 8) {
      res.status(429).json({ error: 'Too many sign-in attempts. Wait a few minutes.' })
      return
    }
    const username = String(req.body?.username || '')
    const password = String(req.body?.password || '')
    const user = await authenticate(username, password)
    if (!user) {
      failures.push(Date.now())
      loginFailures.set(ip, failures)
      res.status(401).json({ error: 'Incorrect username or password.' })
      return
    }
    loginFailures.delete(ip)
    const remember = req.body?.remember !== false
    res.setHeader('Set-Cookie', createSessionCookie(user, remember))
    res.json({ authenticated: true, user: publicUser(user) })
  }))

  router.post('/logout', (_req, res) => {
    res.setHeader('Set-Cookie', clearSessionCookie())
    res.json({ authenticated: false })
  })

  router.get('/session', asyncRoute(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    const user = await loadAdmin(req)
    res.json(user ? { authenticated: true, user: publicUser(user) } : { authenticated: false })
  }))

  router.use(asyncRoute(async (req, res, next) => {
    const user = await loadAdmin(req)
    if (!user) {
      res.status(401).json({ error: 'Sign in required.' })
      return
    }
    req.admin = user
    next()
  }))

  router.use('/users', userRouter())
  router.use(cmsRouter())

  router.get('/codes/stats', asyncRoute(async (_req, res) => {
    res.json(await codeStats())
  }))

  router.get('/codes', json, asyncRoute(async (req, res) => {
    const { page, pageSize } = pageParams(req.query)
    const where = codeWhere(req.query.q)
    const [total, items, stats] = await Promise.all([
      prisma.verificationCode.count({ where }),
      prisma.verificationCode.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          attempts: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { createdAt: true, status: true },
          },
        },
      }),
      codeStats(),
    ])
    const ipCounts = await distinctIpMap(items.map((item) => item.id))
    res.json({
      items: items.map((item) => listItem(item, ipCounts.get(item.id) || 0)),
      total,
      page,
      pageSize,
      stats,
    })
  }))

  router.post('/codes', json, asyncRoute(async (req, res) => {
    const parsed = parseVerificationInput(req.body?.code)
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.reason })
      return
    }

    let serial = parsed.serial
    if (req.body?.serial) {
      const extra = String(req.body.serial).trim()
      if (!/^\d{4,24}$/.test(extra)) {
        res.status(400).json({ error: 'Serial must be 4–24 digits.' })
        return
      }
      if (parsed.token && parsed.serial && parsed.serial !== extra) {
        res.status(400).json({ error: 'That serial does not match the code you entered.' })
        return
      }
      serial = extra
    }

    const token = serial && serial !== parsed.code ? `${serial}-${parsed.code}` : null
    const expiry = readExpiry(req.body?.expiresAt, res)
    if (!expiry.ok) return

    try {
      const created = await prisma.verificationCode.create({
        data: {
          code: parsed.code,
          serial,
          token,
          batchLabel: String(req.body?.batchLabel || '').trim().slice(0, 80) || null,
          notes: String(req.body?.notes || '').trim().slice(0, 2000) || null,
          expiresAt: expiry.value,
        },
      })
      res.status(201).json(created)
    } catch (error) {
      if (error?.code === 'P2002') {
        res.status(409).json({ error: 'That code, serial, or token is already saved.' })
        return
      }
      throw error
    }
  }))

  router.get('/codes/:id', asyncRoute(async (req, res) => {
    const code = await prisma.verificationCode.findUnique({ where: { id: req.params.id } })
    if (!code) {
      res.status(404).json({ error: 'Code not found.' })
      return
    }
    const [attempts, ipPairs] = await Promise.all([
      prisma.verificationAttempt.findMany({
        where: { codeId: code.id },
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: { id: true, input: true, status: true, createdAt: true },
      }),
      prisma.verificationAttempt.groupBy({
        by: ['ipHash'],
        where: { codeId: code.id, NOT: { ipHash: null } },
      }),
    ])
    const distinctIps = ipPairs.length
    res.json({
      ...listItem({ ...code, attempts: attempts.slice(0, 1).map((attempt) => ({ createdAt: attempt.createdAt, status: attempt.status })) }, distinctIps),
      notes: code.notes,
      attempts,
    })
  }))

  router.patch('/codes/:id', json, asyncRoute(async (req, res) => {
    const data = {}
    if (typeof req.body?.isValid === 'boolean') data.isValid = req.body.isValid
    if (typeof req.body?.notes === 'string') data.notes = req.body.notes.trim().slice(0, 2000) || null
    if (typeof req.body?.batchLabel === 'string') data.batchLabel = req.body.batchLabel.trim().slice(0, 80) || null
    if ('expiresAt' in (req.body || {})) {
      const expiry = readExpiry(req.body.expiresAt, res)
      if (!expiry.ok) return
      data.expiresAt = expiry.value
    }
    if (!Object.keys(data).length) {
      res.status(400).json({ error: 'Nothing to update.' })
      return
    }
    try {
      const updated = await prisma.verificationCode.update({
        where: { id: req.params.id },
        data,
      })
      res.json(updated)
    } catch (error) {
      if (error?.code === 'P2025') {
        res.status(404).json({ error: 'Code not found.' })
        return
      }
      throw error
    }
  }))

  router.get('/activity/summary', asyncRoute(async (_req, res) => {
    res.json(await activitySummary())
  }))

  router.get('/activity/checks', asyncRoute(async (req, res) => {
    const codeId = String(req.query.codeId || '').trim()
    const input = String(req.query.input || '').trim().slice(0, 200)
    if (!codeId && !input) {
      res.status(400).json({ error: 'Choose a code.' })
      return
    }
    const where = codeId
      ? { codeId }
      : { codeId: null, input: { equals: input, mode: 'insensitive' } }
    const [total, items] = await Promise.all([
      prisma.verificationAttempt.count({ where }),
      prisma.verificationAttempt.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: { id: true, input: true, status: true, createdAt: true },
      }),
    ])
    res.json({ items, total })
  }))

  router.get('/activity', asyncRoute(async (req, res) => {
    const { page, pageSize } = pageParams(req.query)
    const status = STATUSES.has(req.query.status) ? req.query.status : ''
    const q = String(req.query.q || '').trim()
    const filter = activityFilterSql({ status, q })
    const offset = (page - 1) * pageSize
    const [countRows, groups, summary] = await Promise.all([
      prisma.$queryRaw`
        SELECT COUNT(*)::int AS total FROM (
          SELECT 1
          FROM "VerificationAttempt"
          WHERE ${filter}
          GROUP BY CASE WHEN "codeId" IS NULL THEN 'i:' || lower(input) ELSE 'c:' || "codeId" END
        ) grouped
      `,
      prisma.$queryRaw`
        SELECT
          CASE WHEN "codeId" IS NULL THEN 'i:' || lower(input) ELSE 'c:' || "codeId" END AS "groupKey",
          "codeId",
          (array_agg(input ORDER BY "createdAt" DESC))[1] AS input,
          COUNT(*)::int AS checks,
          COUNT(DISTINCT "ipHash") FILTER (WHERE "ipHash" IS NOT NULL)::int AS "distinctIps",
          (array_agg(status ORDER BY "createdAt" DESC))[1] AS "latestStatus",
          MAX("createdAt") AS "latestAt",
          MIN("createdAt") AS "firstAt"
        FROM "VerificationAttempt"
        WHERE ${filter}
        GROUP BY 1, "codeId"
        ORDER BY "latestAt" DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `,
      activitySummary(),
    ])
    const codeIds = groups.map((group) => group.codeId).filter(Boolean)
    const codes = codeIds.length
      ? await prisma.verificationCode.findMany({ where: { id: { in: codeIds } } })
      : []
    const byId = new Map(codes.map((code) => [code.id, code]))
    res.json({
      items: groups.map((group) => presentActivityGroup(group, byId.get(group.codeId) || null)),
      total: Number(countRows[0]?.total || 0),
      page,
      pageSize,
      summary,
    })
  }))

  router.post('/imports/preview', bigJson, asyncRoute(async (req, res) => {
    if (typeof req.body?.text !== 'string') {
      res.status(400).json({ error: 'Upload a text file.' })
      return
    }
    res.json(await previewImport(req.body.text))
  }))

  router.post('/imports', bigJson, asyncRoute(async (req, res) => {
    if (typeof req.body?.text !== 'string') {
      res.status(400).json({ error: 'Upload a text file.' })
      return
    }
    const record = await commitImport({
      text: req.body.text,
      filename: req.body.filename,
      mode: req.body.mode,
      batchLabel: req.body.batchLabel,
    })
    res.status(201).json(record)
  }))

  router.get('/imports', asyncRoute(async (_req, res) => {
    const items = await prisma.verificationImport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json({ items })
  }))

  return router
}

async function codeStats() {
  const [total, valid, verified, neverVerified] = await Promise.all([
    prisma.verificationCode.count(),
    prisma.verificationCode.count({ where: { isValid: true } }),
    prisma.verificationCode.count({ where: { verificationCount: { gt: 0 } } }),
    prisma.verificationCode.count({ where: { verificationCount: 0 } }),
  ])
  return { total, valid, verified, neverVerified }
}

async function activitySummary() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const [totalChecks, notAuthentic, ipRows, mostTried] = await Promise.all([
    prisma.verificationAttempt.count(),
    prisma.verificationAttempt.count({
      where: { status: { in: ['not_authentic', 'invalid_format', 'disabled', 'expired'] } },
    }),
    prisma.verificationAttempt.findMany({
      where: { createdAt: { gte: dayAgo }, NOT: { ipHash: null } },
      distinct: ['ipHash'],
      select: { ipHash: true },
    }),
    prisma.$queryRaw`
      SELECT input, COUNT(*)::int AS attempts
      FROM "VerificationAttempt"
      GROUP BY input
      ORDER BY attempts DESC
      LIMIT 1
    `,
  ])
  const top = mostTried[0]
  return {
    totalChecks,
    notAuthentic,
    uniqueIps24h: ipRows.length,
    mostTried: top ? { code: top.input, attempts: Number(top.attempts) } : null,
  }
}
