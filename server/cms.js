/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import multer from 'multer'
import prisma from './db.js'
import { hasPermission } from './permissions.js'

export const CMS_KEYS = new Set([
  'site',
  'navigation',
  'home',
  'footer',
  'products',
  'newsletter',
  'exhibition',
  'downloads',
  'support',
])

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cms')
fs.mkdirSync(uploadDir, { recursive: true })

const EXT_MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain',
}

const ALLOWED = new Set(Object.values(EXT_MIME))

function acceptedMime(file) {
  if (ALLOWED.has(file.mimetype)) return file.mimetype
  const ext = path.extname(file.originalname || '').toLowerCase()
  return EXT_MIME[ext] || ''
}

function kindFor(mime) {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return 'document'
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename(_req, file, callback) {
      const ext = path.extname(file.originalName || file.originalname || '').toLowerCase()
      const safeExt = EXT_MIME[ext] ? ext : ''
      callback(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${safeExt}`)
    },
  }),
  limits: { fileSize: 150 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    const mime = acceptedMime(file)
    if (!mime) {
      callback(new Error('Upload an image, video, PDF, ZIP, or text file.'))
      return
    }
    file.mimetype = mime
    callback(null, true)
  },
})

export function uploadMedia(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      next()
      return
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'That file is too large. Maximum size is 150 MB.' })
      return
    }
    res.status(400).json({ error: error.message || 'Upload failed.' })
  })
}

export async function readDocuments() {
  const rows = await prisma.cmsDocument.findMany()
  const documents = {}
  for (const row of rows) documents[row.key] = row.data
  return documents
}

export function documentError(key, data) {
  if (!CMS_KEYS.has(key)) return 'Unknown content section.'
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Content must be an object.'
  const size = Buffer.byteLength(JSON.stringify(data))
  if (size > 6_000_000) return 'That content is too large to save.'
  if (key === 'products' && !Array.isArray(data.items)) return 'Products need a list.'
  if (key === 'exhibition' && !Array.isArray(data.events)) return 'Exhibitions need a list.'
  if (key === 'downloads' && (!Array.isArray(data.groups) || !Array.isArray(data.resources))) return 'Downloads need groups and support documents.'
  if (key === 'support' && (!Array.isArray(data.topics) || !Array.isArray(data.faqs))) return 'Support needs topics and questions.'
  if (key === 'home' && !Array.isArray(data.heroSlides)) return 'Homepage needs hero slides.'
  if (key === 'site' && typeof data.warningText !== 'string') return 'Site settings need the warning text.'
  return ''
}

function requireContent(req, res, next) {
  if (!hasPermission(req.admin.role, 'content')) {
    res.status(403).json({ error: 'You do not have access to this.' })
    return
  }
  next()
}

function presentMedia(row) {
  return {
    id: row.id,
    url: row.url,
    originalName: row.originalName,
    mime: row.mime,
    size: row.size,
    kind: row.kind,
    createdAt: row.createdAt,
  }
}

export function cmsRouter() {
  const router = express.Router()
  const json = express.json({ limit: '8mb' })

  router.get('/cms', requireContent, asyncRoute(async (_req, res) => {
    res.json({ documents: await readDocuments() })
  }))

  router.put('/cms/:key', requireContent, json, asyncRoute(async (req, res) => {
    const key = req.params.key
    const problem = documentError(key, req.body)
    if (problem) {
      res.status(400).json({ error: problem })
      return
    }
    const saved = await prisma.cmsDocument.upsert({
      where: { key },
      create: { key, data: req.body },
      update: { data: req.body },
    })
    res.json({ key: saved.key, data: saved.data, updatedAt: saved.updatedAt })
  }))

  router.get('/media', requireContent, asyncRoute(async (_req, res) => {
    const items = await prisma.cmsMedia.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    res.json({ items: items.map(presentMedia) })
  }))

  router.post('/media', requireContent, uploadMedia, asyncRoute(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'Choose a file to upload.' })
      return
    }
    const created = await prisma.cmsMedia.create({
      data: {
        filename: req.file.filename,
        originalName: String(req.file.originalname || 'file').slice(0, 180),
        mime: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/cms/${req.file.filename}`,
        kind: kindFor(req.file.mimetype),
      },
    })
    res.status(201).json(presentMedia(created))
  }))

  router.delete('/media/:id', requireContent, asyncRoute(async (req, res) => {
    const row = await prisma.cmsMedia.findUnique({ where: { id: req.params.id } })
    if (!row) {
      res.status(404).json({ error: 'File not found.' })
      return
    }
    await prisma.cmsMedia.delete({ where: { id: row.id } })
    const full = path.join(uploadDir, path.basename(row.filename))
    fs.unlink(full, () => {})
    res.json({ ok: true })
  }))

  return router
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}
