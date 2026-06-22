/**
 * Background preload for TOPBAR in Motion films.
 * Starts early on the home page so videos are buffered before the user scrolls down.
 */

const cache = new Map()
let preloadStarted = false
let preloadQueue = Promise.resolve()

function getFilmSources(film) {
  return [
    film.mp4 && { src: film.mp4, type: 'video/mp4' },
    film.mov && { src: film.mov, type: 'video/quicktime' },
  ].filter(Boolean)
}

function markReady(entry) {
  if (entry.ready) return
  entry.ready = true
  entry.listeners.forEach((listener) => listener(true))
}

function warmHttpCache(src) {
  if (!src) return Promise.resolve()
  return fetch(src, { credentials: 'same-origin', cache: 'force-cache' })
    .then((response) => (response.ok ? response.blob() : undefined))
    .catch(() => undefined)
}

function preloadFilm(film) {
  if (!film?.id || cache.has(film.id)) return Promise.resolve()

  const sources = getFilmSources(film)
  if (!sources.length) return Promise.resolve()

  const entry = { ready: false, video: null, listeners: new Set() }
  cache.set(film.id, entry)

  if (film.mp4 && !document.querySelector(`link[data-brand-film-preload="${film.mp4}"]`)) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'video'
    link.href = film.mp4
    link.setAttribute('data-brand-film-preload', film.mp4)
    document.head.appendChild(link)
  }

  const video = document.createElement('video')
  video.preload = 'auto'
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

  const readyPromise = new Promise((resolve) => {
    const onReady = () => {
      markReady(entry)
      resolve()
    }
    video.addEventListener('canplaythrough', onReady, { once: true })
    video.addEventListener('loadeddata', onReady, { once: true })
    video.addEventListener('error', onReady, { once: true })
  })

  video.load()

  const fetchPromise = film.mp4 ? warmHttpCache(film.mp4) : Promise.resolve()
  return Promise.all([readyPromise, fetchPromise])
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
    window.requestIdleCallback(run, { timeout: 800 })
  } else {
    window.setTimeout(run, 150)
  }
}

/** Begin buffering films as soon as the home page is interactive. */
export function warmupBrandFilmsAfterHero(films) {
  if (!films?.length || typeof document === 'undefined') return () => {}

  let started = false
  const begin = () => {
    if (started) return
    started = true
    schedulePreload(films)
  }

  begin()

  const hero = document.querySelector('.parallax-hero')
  let observer

  if (hero) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) begin()
      },
      { threshold: [0, 0.15] },
    )
    observer.observe(hero)
  }

  const fallback = window.setTimeout(begin, 2500)

  return () => {
    observer?.disconnect()
    window.clearTimeout(fallback)
  }
}

export function whenBrandFilmsPreloaded(films) {
  if (!films?.length) return Promise.resolve()
  startBrandFilmPreload(films)
  return preloadQueue
}
