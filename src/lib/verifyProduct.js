/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

const pending = new Map()

export function verifyProduct(raw) {
  const key = String(raw || '').trim()
  if (!key) {
    return Promise.resolve({
      result: 'not_authentic',
      title: 'This product is not authentic.',
      message: 'Enter the security code from your TOPBAR package.',
    })
  }

  const existing = pending.get(key)
  if (existing) return existing

  const promise = fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: key }),
  }).then(async (response) => {
    const data = await response.json().catch(() => null)
    if (response.status === 429 && data?.result) return data
    if (!response.ok || !data?.result) {
      throw new Error('Verification is unavailable right now.')
    }
    return data
  }).finally(() => {
    setTimeout(() => pending.delete(key), 1200)
  })

  pending.set(key, promise)
  return promise
}
