/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Prisma } from '@prisma/client'
import prisma from './db.js'
import { parseImportText } from './parseCode.js'

function chunk(list, size) {
  const parts = []
  for (let index = 0; index < list.length; index += size) parts.push(list.slice(index, index + size))
  return parts
}

function cleanBatch(value) {
  const text = String(value || '').trim()
  return text ? text.slice(0, 80) : null
}

function cleanFilename(name) {
  const base = String(name || 'upload.txt').split(/[/\\]/).pop() || 'upload.txt'
  return base.slice(0, 180)
}

async function loadExisting(rows) {
  const found = { codes: new Map(), serials: new Map(), tokens: new Map() }
  for (const part of chunk(rows, 4000)) {
    const codes = part.map((row) => row.code)
    const serials = part.map((row) => row.serial).filter(Boolean)
    const tokens = part.map((row) => row.token).filter(Boolean)
    const or = [{ code: { in: codes } }]
    if (serials.length) or.push({ serial: { in: serials } })
    if (tokens.length) or.push({ token: { in: tokens } })
    const matches = await prisma.verificationCode.findMany({
      where: { OR: or },
      select: { code: true, serial: true, token: true },
    })
    for (const match of matches) {
      found.codes.set(match.code, match)
      if (match.serial) found.serials.set(match.serial, match)
      if (match.token) found.tokens.set(match.token, match)
    }
  }
  return found
}

async function analyzeImport(text) {
  const parsed = parseImportText(text)
  const found = await loadExisting(parsed.rows)
  const fresh = []
  const sameCode = []
  const conflicts = []
  const errors = [...parsed.errors]

  for (const row of parsed.rows) {
    if (found.codes.has(row.code)) {
      sameCode.push(row)
      continue
    }
    const serialOwner = row.serial ? found.serials.get(row.serial) : null
    const tokenOwner = row.token ? found.tokens.get(row.token) : null
    if (serialOwner || tokenOwner) {
      conflicts.push(row)
      if (errors.length < 50) {
        errors.push({
          line: row.line,
          value: row.code,
          reason: 'Serial or token already belongs to another code.',
        })
      }
      continue
    }
    fresh.push(row)
  }

  return { ...parsed, fresh, sameCode, conflicts, errors }
}

function summarize(analyzed) {
  return {
    totalRows: analyzed.totalRows,
    newCodes: analyzed.fresh.length,
    existing: analyzed.sameCode.length,
    invalid: analyzed.invalid + analyzed.conflicts.length,
    duplicatesInFile: analyzed.duplicatesInFile,
    errors: analyzed.errors.slice(0, 20),
  }
}

async function insertFresh(rows, batchLabel) {
  let inserted = 0
  for (const part of chunk(rows, 1000)) {
    const result = await prisma.verificationCode.createMany({
      data: part.map((row) => ({
        code: row.code,
        serial: row.serial,
        token: row.token,
        batchLabel,
      })),
      skipDuplicates: true,
    })
    inserted += result.count
  }
  return inserted
}

async function updateExisting(rows, batchLabel) {
  let updated = 0
  for (const part of chunk(rows, 100)) {
    const values = Prisma.join(part.map((row) => Prisma.sql`(
      ${row.code}::text,
      ${row.serial}::text,
      ${row.token}::text,
      ${batchLabel}::text
    )`))
    const changed = await prisma.$executeRaw`
      UPDATE "VerificationCode" AS c SET
        serial = COALESCE(v.serial, c.serial),
        token = COALESCE(v.token, c.token),
        "batchLabel" = COALESCE(v.batch, c."batchLabel"),
        "updatedAt" = NOW()
      FROM (VALUES ${values}) AS v(code, serial, token, batch)
      WHERE c.code = v.code
    `
    updated += Number(changed)
  }
  return updated
}

export async function previewImport(text) {
  return summarize(await analyzeImport(text))
}

export async function commitImport({ text, filename, mode, batchLabel }) {
  const safeMode = mode === 'update' ? 'update' : 'skip'
  const batch = cleanBatch(batchLabel)
  const analyzed = await analyzeImport(text)
  let inserted = 0
  let updated = 0

  if (analyzed.fresh.length) inserted = await insertFresh(analyzed.fresh, batch)
  if (safeMode === 'update' && analyzed.sameCode.length) {
    updated = await updateExisting(analyzed.sameCode, batch)
  }

  const skipped = analyzed.duplicatesInFile
    + (safeMode === 'skip' ? analyzed.sameCode.length : Math.max(0, analyzed.sameCode.length - updated))
    + Math.max(0, analyzed.fresh.length - inserted)
  const invalid = analyzed.invalid + analyzed.conflicts.length

  return prisma.verificationImport.create({
    data: {
      filename: cleanFilename(filename),
      mode: safeMode,
      totalRows: analyzed.totalRows,
      inserted,
      updated,
      skipped,
      invalid,
      errorSample: analyzed.errors.slice(0, 20),
    },
  })
}
