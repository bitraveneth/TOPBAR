/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

const CODE_RE = /^[A-Z0-9]{4,32}$/
const SERIAL_RE = /^\d{4,24}$/
const TOKEN_RE = /^(\d{4,24})-([A-Z0-9]{4,32})$/
const HEADER_WORDS = new Set([
  'code',
  'serial',
  'token',
  'url',
  'link',
  'verify',
  'verification',
  '二维码',
  '防伪码',
  'qr',
  'qrcode',
])

function compact(value) {
  return String(value ?? '').trim().replace(/\s+/g, '')
}

function clip(value, max = 120) {
  const text = String(value || '')
  if (text.length <= max) return text
  return `${text.slice(0, max)}…`
}

function bareQuery(search) {
  const raw = String(search || '').replace(/^\?/, '')
  if (!raw || raw.includes('=') || raw.includes('&') || raw.includes(',')) return ''
  return raw
}

function codeFromUrl(value) {
  const url = new URL(value)
  return url.searchParams.get('t') || url.searchParams.get('code') || bareQuery(url.search) || ''
}

function fromQuery(value) {
  const queryIndex = value.indexOf('?')
  if (queryIndex === -1) return ''
  const query = value.slice(queryIndex)
  const params = new URLSearchParams(query)
  return params.get('t') || params.get('code') || bareQuery(query) || ''
}

function asRecord(code, serial) {
  const token = serial && serial !== code ? `${serial}-${code}` : null
  return {
    ok: true,
    code,
    serial: serial || null,
    token,
    display: token || code,
  }
}

export function parseVerificationInput(raw) {
  const compactValue = compact(raw)
  if (!compactValue) return { ok: false, reason: 'Enter a security code.' }

  let token = compactValue
  if (/^https?:\/\//i.test(compactValue)) {
    try {
      token = codeFromUrl(compactValue)
    } catch {
      return { ok: false, reason: 'That link could not be read.' }
    }
    if (!token) return { ok: false, reason: 'That link has no security code.' }
    token = compact(token)
  } else if (compactValue.includes('?')) {
    const loose = fromQuery(compactValue)
    if (loose) token = compact(loose)
  }

  token = token.toUpperCase()
  const pair = token.match(TOKEN_RE)
  if (pair) return asRecord(pair[2], pair[1])
  if (SERIAL_RE.test(token)) return asRecord(token, token)
  if (CODE_RE.test(token)) return asRecord(token, null)
  return { ok: false, reason: 'Use the scratch code or the full verify link.' }
}

function splitCells(line) {
  return line
    .split(/[,\t]/)
    .map((cell) => cell.trim().replace(/^["']|["']$/g, '').trim())
    .filter((cell) => cell.length > 0)
}

function isHeader(line) {
  const cells = splitCells(line).map((cell) => cell.toLowerCase().replace(/\s+/g, ''))
  if (!cells.length) return false
  if (cells.every((cell) => HEADER_WORDS.has(cell))) return true
  return cells.some((cell) => cell.includes('二维码') || cell.includes('防伪码'))
}

function parseCells(line) {
  const cells = splitCells(line).map((cell) => compact(cell).toUpperCase())
  if (cells.length < 2) return parseVerificationInput(line)
  const [first, second] = cells
  const firstSerial = SERIAL_RE.test(first)
  const secondSerial = SERIAL_RE.test(second)
  const firstCode = CODE_RE.test(first)
  const secondCode = CODE_RE.test(second)

  if (firstSerial && secondCode && !secondSerial) return asRecord(second, first)
  if (secondSerial && firstCode && !firstSerial) return asRecord(first, second)
  return { ok: false, reason: 'Could not tell the code from the serial.' }
}

function cellCode(cell) {
  const text = compact(cell)
  if (!text) return ''
  if (/^https?:\/\//i.test(text) || text.includes('?')) {
    try {
      return compact(/^https?:\/\//i.test(text) ? codeFromUrl(text) : fromQuery(text))
    } catch {
      return ''
    }
  }
  return text
}

export function parseImportLine(line) {
  const trimmed = line.trim()
  if (/[,\t]/.test(trimmed)) {
    const cells = splitCells(trimmed)
    const codes = cells.map(cellCode).filter(Boolean)
    const sameNumber = codes.length >= 2 && codes.every((item) => item.toUpperCase() === codes[0].toUpperCase())
    if (sameNumber) return parseVerificationInput(codes[0])
    if (!/^https?:\/\//i.test(trimmed) && !trimmed.includes('?')) return parseCells(trimmed)
    const securityCode = codes.at(-1)
    if (securityCode) return parseVerificationInput(securityCode)
  }
  return parseVerificationInput(trimmed)
}

export function parseImportText(text) {
  const source = String(text || '').replace(/^\uFEFF/, '')
  const lines = source.split(/\r?\n/)
  const errors = []
  const seenCodes = new Set()
  const seenSerials = new Set()
  const rows = []
  let totalRows = 0
  let duplicatesInFile = 0
  let invalid = 0

  lines.forEach((original, index) => {
    const lineNo = index + 1
    const line = original.trim()
    if (!line) return
    if (lineNo === 1 && isHeader(line)) return

    totalRows += 1
    const parsed = parseImportLine(line)
    if (!parsed.ok) {
      invalid += 1
      if (errors.length < 50) errors.push({ line: lineNo, value: clip(line), reason: parsed.reason })
      return
    }
    if (seenCodes.has(parsed.code)) {
      duplicatesInFile += 1
      if (errors.length < 50) errors.push({ line: lineNo, value: parsed.code, reason: 'Duplicate code in this file.' })
      return
    }
    if (parsed.serial && seenSerials.has(parsed.serial)) {
      invalid += 1
      if (errors.length < 50) errors.push({ line: lineNo, value: parsed.serial, reason: 'Duplicate serial in this file.' })
      return
    }
    seenCodes.add(parsed.code)
    if (parsed.serial) seenSerials.add(parsed.serial)
    rows.push({
      line: lineNo,
      code: parsed.code,
      serial: parsed.serial,
      token: parsed.token,
    })
  })

  return { totalRows, rows, duplicatesInFile, invalid, errors }
}
