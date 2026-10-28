/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import crypto from 'node:crypto'
import prisma from './db.js'
import { parseVerificationInput } from './parseCode.js'

const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 20

function clip(value, max) {
  return String(value || '').slice(0, max)
}

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || process.env.ADMIN_SESSION_SECRET || 'topbar'
  return crypto.createHash('sha256').update(`${salt}:${ip || 'unknown'}`).digest('hex')
}

function notAuthentic() {
  return {
    result: 'not_authentic',
    title: 'This product is not authentic.',
    message: 'This code does not match a genuine TOPBAR product. Do not use it.',
  }
}

async function findCode(tx, parsed) {
  const byCode = await tx.verificationCode.findUnique({ where: { code: parsed.code } })
  if (byCode) return byCode
  if (parsed.token) {
    const byToken = await tx.verificationCode.findUnique({ where: { token: parsed.token } })
    if (byToken) return byToken
  }
  if (parsed.serial) {
    return tx.verificationCode.findUnique({ where: { serial: parsed.serial } })
  }
  return null
}

async function rejectCode(tx, record, status, parsed, ipHash, userAgent) {
  if (record) {
    await tx.verificationCode.update({
      where: { id: record.id },
      data: { attemptCount: { increment: 1 } },
    })
  }
  await tx.verificationAttempt.create({
    data: {
      input: parsed.display,
      status,
      ipHash,
      userAgent,
      codeId: record?.id || null,
    },
  })
  return { statusCode: 200, body: notAuthentic() }
}

export async function verifyCode(raw, meta) {
  const parsed = parseVerificationInput(raw)
  const ipHash = hashIp(meta.ip)
  const userAgent = clip(meta.userAgent, 180)
  const since = new Date(Date.now() - WINDOW_MS)
  const recent = await prisma.verificationAttempt.count({
    where: { ipHash, createdAt: { gte: since } },
  })

  if (recent >= LIMIT) {
    return {
      statusCode: 429,
      body: {
        result: 'rate_limited',
        title: 'Too many attempts',
        message: 'Wait a few minutes, then try this code again.',
      },
    }
  }

  if (!parsed.ok) {
    await prisma.verificationAttempt.create({
      data: {
        input: clip(raw, 200),
        status: 'invalid_format',
        ipHash,
        userAgent,
      },
    })
    return { statusCode: 200, body: notAuthentic() }
  }

  return prisma.$transaction(async (tx) => {
    const record = await findCode(tx, parsed)
    const now = new Date()

    if (!record) return rejectCode(tx, null, 'not_authentic', parsed, ipHash, userAgent)

    const expired = Boolean(record.expiresAt && record.expiresAt <= now)
    if (!record.isValid || expired) {
      return rejectCode(tx, record, record.isValid ? 'expired' : 'disabled', parsed, ipHash, userAgent)
    }

    const claimed = await tx.verificationCode.updateMany({
      where: {
        id: record.id,
        isValid: true,
        verificationCount: 0,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      data: {
        verificationCount: { increment: 1 },
        attemptCount: { increment: 1 },
        firstVerifiedAt: now,
      },
    })

    if (claimed.count === 1) {
      await tx.verificationAttempt.create({
        data: {
          input: parsed.display,
          status: 'genuine_first',
          ipHash,
          userAgent,
          codeId: record.id,
        },
      })
      return {
        statusCode: 200,
        body: {
          result: 'genuine',
          title: 'Genuine TOPBAR product',
          message: 'This is the first verification of this security code.',
          checkedAt: now.toISOString(),
          firstVerifiedAt: now.toISOString(),
          verificationCount: 1,
          checkedCode: record.code,
        },
      }
    }

    const fresh = await tx.verificationCode.findUnique({ where: { id: record.id } })
    const freshExpired = Boolean(fresh?.expiresAt && fresh.expiresAt <= new Date())
    if (!fresh || !fresh.isValid || freshExpired) {
      return rejectCode(tx, fresh, fresh && !fresh.isValid ? 'disabled' : 'expired', parsed, ipHash, userAgent)
    }

    const updated = await tx.verificationCode.update({
      where: { id: fresh.id },
      data: {
        verificationCount: { increment: 1 },
        attemptCount: { increment: 1 },
      },
    })
    await tx.verificationAttempt.create({
      data: {
        input: parsed.display,
        status: 'already_verified',
        ipHash,
        userAgent,
        codeId: fresh.id,
      },
    })
    return {
      statusCode: 200,
      body: {
        result: 'already_verified',
        title: 'This product was already verified',
        message: 'If you did not check this code before, treat the pack as suspicious and contact TOPBAR support before use.',
        checkedAt: new Date().toISOString(),
        firstVerifiedAt: updated.firstVerifiedAt ? updated.firstVerifiedAt.toISOString() : null,
        verificationCount: updated.verificationCount,
        checkedCode: updated.code,
      },
    }
  })
}
