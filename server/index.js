/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import express from 'express'
import prisma from './db.js'
import { adminRouter } from './admin.js'
import { readDocuments } from './cms.js'
import { ensureSuperadmin } from './users.js'
import { verifyCode } from './verifyService.js'
import { clientIp } from './request.js'

if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
  console.error('DATABASE_URL and DIRECT_URL are required.')
  process.exit(1)
}
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
  console.error('ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET are required.')
  process.exit(1)
}

const app = express()
app.disable('x-powered-by')

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

app.get('/api/health', asyncRoute(async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`
  res.json({ ok: true })
}))

app.get('/api/cms', asyncRoute(async (_req, res) => {
  res.json({ documents: await readDocuments() })
}))

app.post('/api/verify', express.json({ limit: '8kb' }), asyncRoute(async (req, res) => {
  const outcome = await verifyCode(req.body?.code ?? '', {
    ip: clientIp(req),
    userAgent: req.headers['user-agent'] || '',
  })
  res.status(outcome.statusCode).json(outcome.body)
}))

app.use('/api/admin', adminRouter())

app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.too.large') {
    res.status(413).json({ error: 'That file is too large.' })
    return
  }
  if (error instanceof SyntaxError && Object.hasOwn(error, 'body')) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }
  console.error(error?.message || error)
  if (!res.headersSent) res.status(500).json({ error: 'Something went wrong.' })
})

const port = Number(process.env.PORT) || 4000

ensureSuperadmin()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Verification API listening on ${port}`)
    })
  })
  .catch((error) => {
    console.error(error?.message || error)
    process.exit(1)
  })
