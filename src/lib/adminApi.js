/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export async function adminFetch(path, options = {}) {
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData
  const headers = {
    ...(options.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed.')
    error.status = response.status
    throw error
  }
  return data
}
