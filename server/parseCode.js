/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

const CODE_RE = /^[A-Z0-9]{4,32}$/
const SERIAL_RE = /^\d{4,24}$/
const TOKEN_RE = /^(\d{4,24})-([A-Z0-9]{4,32})$/
const HEADER_WORDS = new Set(['code', 'serial', 'token', 'url', 'link', 'verify', 'verification'])

function compact(value) {
  return String(value ?? '').trim().replace(/\s+/g, '')
}

function clip(value, max = 120) {
  const text = String(value || '')
  if (text.length <= max) return text
  return `${text.slice(0, max)}…`
}

function fromQuery(value) {
  const queryIndex = value.indexOf('?')
  if (queryIndex === -1) return ''
  const params = new URLSearchParams(value.slice(queryIndex + 1))
  return params.get('t') || params.get('code') || ''
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
      const url = new URL(compactValue)
      token = url.searchParams.get('t') || url.searchParams.get('code') || ''
    } catch {
      return { ok: false, reason: 'That link could not be read.' }
    }
    if (!token) return { ok: false, reason: 'Link is missing a t or code parameter.' }
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
  const cells = splitCells(line).map((cell) => cell.toLowerCase())
  return cells.length > 0 && cells.every((cell) => HEADER_WORDS.has(cell))
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

export function parseImportLine(line) {
  if (/^https?:\/\//i.test(line) || line.includes('?')) return parseVerificationInput(line)
  if (/[,\t]/.test(line)) return parseCells(line)
  return parseVerificationInput(line)
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
