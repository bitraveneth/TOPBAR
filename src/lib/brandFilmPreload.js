/**
 * Lazy preload for TOPBAR in Motion films — only when the section is near the viewport.
 */

const cache = new Map()
let preloadStarted = false
let preloadQueue = Promise.resolve()

function getFilmSources(film) {
  return film.mp4 ? [{ src: film.mp4, type: 'video/mp4' }] : []
}

function markReady(entry) {
  if (entry.ready) return
  entry.ready = true
  entry.listeners.forEach((listener) => listener(true))
}

function preloadFilm(film) {
  if (!film?.id || cache.has(film.id)) return Promise.resolve()

  const sources = getFilmSources(film)
  if (!sources.length) return Promise.resolve()

  const entry = { ready: false, video: null, listeners: new Set() }
  cache.set(film.id, entry)

  const video = document.createElement('video')
  video.preload = 'metadata'
  video.muted = true
  video.playsInline = true
  video.setAttribute('aria-hidden', 'true')
  video.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none'
  document.body.appendChild(video)
  entry.video = video

  sources.forEach((source) => {
    const node = document.createElement('source')
    node.src = source.src
    node.type = source.type
    video.appendChild(node)
  })

  return new Promise((resolve) => {
    const onReady = () => {
      markReady(entry)
      resolve()
    }
    video.addEventListener('loadedmetadata', onReady, { once: true })
    video.addEventListener('error', onReady, { once: true })
    video.load()
  })
}

export function isBrandFilmPreloaded(filmId) {
  return cache.get(filmId)?.ready ?? false
}

export function subscribeBrandFilmPreload(filmId, listener) {
  const entry = cache.get(filmId)
  if (!entry) return () => {}
  if (entry.ready) {
    listener(true)
    return () => {}
  }
  entry.listeners.add(listener)
  return () => entry.listeners.delete(listener)
}

export function startBrandFilmPreload(films) {
  if (preloadStarted || !films?.length) return
  preloadStarted = true

  const queue = films.filter((film) => film?.id && getFilmSources(film).length)
  preloadQueue = queue.reduce(
    (chain, film) => chain.then(() => preloadFilm(film)),
    Promise.resolve(),
  )
}

function schedulePreload(films) {
  const run = () => startBrandFilmPreload(films)
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 2000 })
  } else {
    window.setTimeout(run, 500)
  }
}

/** Buffer films only when the brand video section scrolls into view. */
export function warmupBrandFilmsAfterHero(films) {
  if (!films?.length || typeof document === 'undefined') return () => {}

  let started = false
  const begin = () => {
    if (started) return
    started = true
    schedulePreload(films)
  }

  const section = document.querySelector('.brand-motion')
  if (!section) return () => {}

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) begin()
    },
    { rootMargin: '300px 0px', threshold: 0 },
  )
  observer.observe(section)

  return () => observer.disconnect()
}

export function whenBrandFilmsPreloaded(films) {
  if (!films?.length) return Promise.resolve()
  startBrandFilmPreload(films)
  return preloadQueue
}
