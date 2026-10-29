/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { placeFromIp } from './place.js'

test('does not locate a private address', () => {
  assert.deepEqual(placeFromIp('127.0.0.1'), { country: null, region: null })
  assert.deepEqual(placeFromIp(''), { country: null, region: null })
})

test('names a public address by country and state when the data has them', () => {
  const china = placeFromIp('223.5.5.5')
  assert.equal(china.country, 'China')
  assert.equal(china.region, 'Zhejiang')

  const california = placeFromIp('9.9.9.9')
  assert.equal(california.country, 'United States')
  assert.equal(california.region, 'California')
})
