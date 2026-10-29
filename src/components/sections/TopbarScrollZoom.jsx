/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronsDown } from 'lucide-react'

const WORDMARK_SRC = '/assets/images/topbar-wordmark-white.png'

const TOPBAR_PHASE = {
  ZOOM_MAX_AT: 0.38,
  FADE_START: 0.2,
  FADE_END: 0.48,
  REVEAL_END: 0.72,
}
const SCROLL_HINT_DELAY_MS = 1000
function segment(p, start, end, power = 1) {
  if (end <= start) return 0
  const t = Math.min(1, Math.max(0, (p - start) / (end - start)))
  return power === 1 ? t : Math.pow(t, power)
}

function TopbarScrollZoom({ tagline = '' }) {
  const sectionRef = useRef(null)
  const textVideoRef = useRef(null)
  const fullVideoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [scrollHintAfterDelay, setScrollHintAfterDelay] = useState(false)
  const smoothZoomProgress = Math.pow(segment(progress, 0, TOPBAR_PHASE.ZOOM_MAX_AT), 1.18)
  const smoothFadeProgress = Math.pow(
    segment(progress, TOPBAR_PHASE.FADE_START, TOPBAR_PHASE.FADE_END),
    1.28
  )
  const pastWordmarkFade = progress >= TOPBAR_PHASE.FADE_END
  const revealProgress = pastWordmarkFade
    ? Math.pow(segment(progress, TOPBAR_PHASE.FADE_END, TOPBAR_PHASE.REVEAL_END), 0.9)
    : 0

  const { taglineOpacity, fullscreenLayerOpacity } = useMemo(() => {
    const tLine = tagline && pastWordmarkFade
      ? Math.pow(segment(progress, TOPBAR_PHASE.FADE_END, TOPBAR_PHASE.REVEAL_END + 0.06), 0.9)
      : 0
    const fOp = pastWordmarkFade ? revealProgress : 0
    return { taglineOpacity: tLine, fullscreenLayerOpacity: fOp }
  }, [tagline, progress, pastWordmarkFade, revealProgress])

  useEffect(() => {
    if (!pastWordmarkFade) return undefined
    const id = window.setTimeout(() => setScrollHintAfterDelay(true), SCROLL_HINT_DELAY_MS)
    return () => {
      window.clearTimeout(id)
      setScrollHintAfterDelay(false)
    }
  }, [pastWordmarkFade])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const el = sectionRef.current
      const rect = el.getBoundingClientRect()
      const vh = window.visualViewport?.height ?? window.innerHeight
      const h = Math.max(1, rect.height, el.offsetHeight)
      const rawRange = h - vh
      const scrollRange = rawRange >= 1 ? rawRange : Math.max(1, h * 0.65)
      const traveled = Math.min(scrollRange, Math.max(0, -rect.top))
      const nextProgress = Math.min(1, Math.max(0, traveled / scrollRange))
      setProgress(nextProgress)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    window.visualViewport?.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.visualViewport?.removeEventListener('resize', handleScroll)
    }
  }, [])

  const fullVideoArmedRef = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    const textV = textVideoRef.current
    if (!el) return

    const playText = () => {
      const p = textV?.play?.()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    if (textV) {
      textV.muted = true
      textV.setAttribute('playsinline', '')
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) playText()
      },
      { root: null, threshold: 0.08, rootMargin: '0px 0px 12% 0px' }
    )
    obs.observe(el)
    playText()

    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fullV = fullVideoRef.current
    if (!fullV) return
    if (fullVideoArmedRef.current) return
    if (progress < TOPBAR_PHASE.FADE_START) return

    fullVideoArmedRef.current = true
    fullV.muted = true
    fullV.setAttribute('playsinline', '')
    try {
      fullV.load()
    } catch {
      /* noop */
    }
    const p = fullV.play?.()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [progress])

  return (
    <section className="topbar-zoom-section" ref={sectionRef}>
      <div
        className="topbar-zoom-fullscreen"
        aria-hidden="true"
        style={{ '--stage-two-progress': revealProgress, '--fs-opacity': fullscreenLayerOpacity }}
      >
        <video
          ref={fullVideoRef}
          className="topbar-zoom-fullscreen-video"
          loop
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          controls={false}
        >
          <source src="/assets/videos/topbar-cloud.mp4" type="video/mp4" />
        </video>
        <div className="topbar-zoom-fullscreen-overlay" />
      </div>
      <div className="topbar-zoom-sticky">
        <div
          className="topbar-zoom-text-wrap"
          style={{ '--zoom-progress': smoothZoomProgress, '--fade-progress': smoothFadeProgress }}
        >
          <div
            className="topbar-zoom-text"
            role="img"
            aria-label="TOP BAR logo with video"
          >
            <div className="topbar-zoom-video-mask" aria-hidden="true">
              <img
                className="topbar-zoom-wordmark-static"
                src={WORDMARK_SRC}
                alt="TOPBAR"
                width={1024}
                height={205}
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
              <video
                ref={textVideoRef}
                className="topbar-zoom-text-video"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                controls={false}
              >
                <source src="/assets/videos/topbar-cloud.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          {tagline ? (
            <p
              className="topbar-zoom-tagline"
              style={{
                opacity: taglineOpacity,
                transform: `translateY(${(1 - taglineOpacity) * 10}px)`,
                pointerEvents: taglineOpacity < 0.02 ? 'none' : undefined,
                transition: 'opacity 0.45s ease, transform 0.5s ease',
              }}
              aria-hidden={taglineOpacity < 0.05}
            >
              {tagline}
            </p>
          ) : null}
          <div
            className="topbar-scroll-hint topbar-scroll-hint--under-tagline"
            style={{
              opacity: pastWordmarkFade && scrollHintAfterDelay ? 1 : 0,
              transform: `translateY(${pastWordmarkFade && scrollHintAfterDelay ? 0 : 12}px)`,
              pointerEvents: pastWordmarkFade && scrollHintAfterDelay ? undefined : 'none',
              transition: 'opacity 0.55s ease, transform 0.55s ease',
            }}
            aria-hidden={!pastWordmarkFade || !scrollHintAfterDelay}
            aria-label="Scroll down for more"
          >
            <span className="topbar-scroll-hint__label" aria-hidden="true">
              Scroll
            </span>
            <span className="topbar-scroll-hint__track" aria-hidden="true">
              <span className="topbar-scroll-hint__track-dot" />
            </span>
            <span className="topbar-scroll-hint__icon" aria-hidden="true">
              <ChevronsDown className="topbar-scroll-hint__chev" strokeWidth={2.4} size={32} />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopbarScrollZoom
