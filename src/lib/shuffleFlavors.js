/**
 * Deterministic shuffle for flavor cards — stable across re-renders, varies when data changes.
 */

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return hash >>> 0
}

export function seededShuffle(items, seed) {
  const next = [...items]
  let state = seed >>> 0

  for (let i = next.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const j = state % (i + 1)
    ;[next[i], next[j]] = [next[j], next[i]]
  }

  return next
}

export function buildFlavorShuffleSeed(featuredProductSlugs, flavorOrderBySlug) {
  return hashString(`${featuredProductSlugs.join('|')}:${JSON.stringify(flavorOrderBySlug)}`)
}
