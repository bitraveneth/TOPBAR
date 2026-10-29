/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { parseImportText, parseVerificationInput } from './parseCode.js'

test('reads a verify link, a token, and a scratch code', () => {
  const fromLink = parseVerificationInput('https://topbar.example/verify-products?t=517500000018-ATBRGB7P&utm=qr')
  assert.equal(fromLink.ok, true)
  assert.equal(fromLink.code, 'ATBRGB7P')
  assert.equal(fromLink.serial, '517500000018')
  assert.equal(fromLink.token, '517500000018-ATBRGB7P')

  const fromToken = parseVerificationInput('517500000018-atbrgb7p')
  assert.equal(fromToken.code, 'ATBRGB7P')

  const fromCode = parseVerificationInput(' atbr gb7p ')
  assert.equal(fromCode.code, 'ATBRGB7P')
  assert.equal(fromCode.serial, null)

  const loose = parseVerificationInput('/verify-products?code=coke1234')
  assert.equal(loose.code, 'COKE1234')
})

test('reads a 16-digit security code without a link', () => {
  const typed = parseVerificationInput('2860994911575137')
  assert.equal(typed.ok, true)
  assert.equal(typed.code, '2860994911575137')
  assert.equal(typed.serial, '2860994911575137')

  const fromLink = parseVerificationInput('https://www.topbarvape.com?2860994911575137')
  assert.equal(fromLink.code, '2860994911575137')

  const sheet = [
    '二维码,防伪码,',
    'https://www.topbarvape.com?2860106339932431,2860106339932431',
    '2860592586370971',
    '2860836400377021',
  ].join('\n')
  const parsed = parseImportText(sheet)
  assert.equal(parsed.invalid, 0)
  assert.deepEqual(parsed.rows.map((row) => row.code), [
    '2860106339932431',
    '2860592586370971',
    '2860836400377021',
  ])
})

test('rejects empty and unreadable lines', () => {
  assert.equal(parseVerificationInput('   ').ok, false)
  assert.equal(parseVerificationInput('ab').ok, false)
  assert.equal(parseVerificationInput('https://topbar.example/verify-products').ok, false)
})

test('parses text and csv imports', () => {
  const text = [
    'code,serial',
    'https://topbar.example/verify-products?t=517500000018-ATBRGB7P',
    '517500000019-BTCXGB8P',
    'MUJ8VS8',
    '517500000020,GSRS7N4',
    '"QTBRI8B","517500000021"',
    'ATBRGB7P',
    'no',
    '517500000022,517500000023',
    '',
  ].join('\n')

  const parsed = parseImportText(text)
  assert.equal(parsed.totalRows, 8)
  assert.equal(parsed.duplicatesInFile, 1)
  assert.equal(parsed.invalid, 2)
  assert.equal(parsed.rows.length, 5)
  assert.deepEqual(parsed.rows.map((row) => row.code), [
    'ATBRGB7P',
    'BTCXGB8P',
    'MUJ8VS8',
    'GSRS7N4',
    'QTBRI8B',
  ])
  assert.equal(parsed.rows[3].serial, '517500000020')
  assert.equal(parsed.rows[4].serial, '517500000021')
  assert.equal(parsed.rows.length + parsed.duplicatesInFile + parsed.invalid, parsed.totalRows)
})
