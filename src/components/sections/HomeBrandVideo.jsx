/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Droplets,
  Film,
  Globe,
  Layers,
  Package,
  Minimize2,
  Maximize2,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { DEFAULT_SHARE_TEXT, getBrandFilmShareUrl } from '../../lib/brandFilmShare'
import BrandFilmShareSheet from './BrandFilmShareSheet'

function getFullscreenElement() {
  return (
    document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || null
  )
}

const DEFAULT_STATS = [
  { target: 32, suffix: '+', label: 'Flavors', desc: 'Bold profiles across the TOPBAR lineup' },
  { target: 4, suffix: '', label: 'Devices', desc: 'From 8K to 60K flagship disposables' },
  { target: 30, suffix: '+', label: 'Countries', desc: 'Markets across the Americas, Europe, and Asia' },
  { target: 10, suffix: 'M+', label: 'Units sold', desc: 'Trusted by vapers across our global markets' },
]

const HIGHLIGHT_ICONS = [Droplets, Layers, Globe, Package]

function useCountUp(target, duration = 2200, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) {
      setCount(0)
      return undefined
    }

    let startTime = null
    let frame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, start])

  return count
}

function BrandMotionStatValue({ target, suffix = '', inView, reduceMotion }) {
  const count = useCountUp(target, 2200, inView && !reduceMotion)
  const display = reduceMotion || !inView ? target : count

  return (
    <>
      <span className="brand-motion__highlight-num">{display}</span>
      {suffix && <span className="brand-motion__highlight-suffix">{suffix}</span>}
    </>
  )
}

function HomeBrandVideo({
  title = 'TOPBAR in Motion',
  subtitle = '',
  poster = '/images/video/topbar-brand-poster.webp',
  mp4,
  mov,
  stats = DEFAULT_STATS,
  ctaLabel = 'Explore the lineup',
  ctaLink = '/products',
  ctaTagline = 'Discover the full TOPBAR range — devices, flavors, and everyday carry.',
  fallbackTitle = 'Preview the TOPBAR story',
  fallbackMessage = 'Tap play to watch the brand film, or browse the lineup below.',
}) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(true)
  const [progress, setProgress] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareFeedback, setShareFeedback] = useState(null)

  const sources = [
    mp4 && { src: mp4, type: 'video/mp4' },
    mov && { src: mov, type: 'video/quicktime' },
  ].filter(Boolean)

  const statItems = stats?.length ? stats : DEFAULT_STATS

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video || !sources.length) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35
        setInView(visible)
        if (reduceMotion) return
        if (visible) {
          video.play().then(() => setPaused(false)).catch(() => setPaused(true))
        } else {
          video.pause()
          setPaused(true)
        }
      },
      { threshold: [0, 0.35, 0.6], rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [reduceMotion, sources.length])

  useEffect(() => {
    const syncFullscreen = () => {
      const frame = frameRef.current
      setIsFullscreen(Boolean(frame && getFullscreenElement() === frame))
    }

    document.addEventListener('fullscreenchange', syncFullscreen)
    document.addEventListener('webkitfullscreenchange', syncFullscreen)
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen)
      document.removeEventListener('webkitfullscreenchange', syncFullscreen)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPaused(false)).catch(() => setPaused(true))
    } else {
      video.pause()
      setPaused(true)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const target = frameRef.current
    if (!target) return

    if (getFullscreenElement() === target) {
      const exit =
        document.exitFullscreen
        || document.webkitExitFullscreen
        || document.mozCancelFullScreen
      exit?.call(document)?.catch?.(() => {})
      return
    }

    const enter =
      target.requestFullscreen
      || target.webkitRequestFullscreen
      || target.mozRequestFullScreen
    enter?.call(target)?.catch?.(() => {})
  }, [])

  useEffect(() => {
    if (!shareFeedback) return undefined
    const timer = window.setTimeout(() => setShareFeedback(null), 2800)
    return () => window.clearTimeout(timer)
  }, [shareFeedback])

  const toggleShareSheet = useCallback((event) => {
    event.stopPropagation()
    setShareOpen((open) => !open)
    if (shareOpen) setShareFeedback(null)
  }, [shareOpen])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video?.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }, [])

  const retryMedia = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setMediaError(false)
    setReady(false)
    setPaused(true)
    video.load()
    video.play().then(() => setPaused(false)).catch(() => setPaused(true))
  }, [])

  if (!sources.length) return null

  const isPlaying = inView && !paused && !reduceMotion && !mediaError
  const showCenterPlay = (ready || mediaError) && paused && !isPlaying

  return (
    <section
      ref={sectionRef}
      id="brand-motion"
      className={`brand-motion section${inView ? ' brand-motion--in-view' : ''}${isPlaying ? ' brand-motion--playing' : ''}${paused ? ' brand-motion--paused' : ''}${mediaError ? ' brand-motion--fallback' : ''}${isFullscreen ? ' brand-motion--fullscreen' : ''}${shareOpen ? ' brand-motion--share-open' : ''}`}
      aria-labelledby="brand-motion-heading"
    >
      <div className="brand-motion__ambient" aria-hidden="true" />
      <div className="container">
        <header className="brand-motion__header">
          <span className="brand-motion__eyebrow">
            <Film size={16} aria-hidden="true" />
            Brand film
          </span>
          <h2 id="brand-motion-heading" className="section-hero-title brand-motion__title">
            {title}
          </h2>
          {subtitle && <p className="brand-motion__sub">{subtitle}</p>}
        </header>

        <div className="brand-motion__stage">
          <div ref={frameRef} className="brand-motion__frame">
            <span className="brand-motion__corner brand-motion__corner--tl" aria-hidden="true" />
            <span className="brand-motion__corner brand-motion__corner--tr" aria-hidden="true" />
            <span className="brand-motion__corner brand-motion__corner--bl" aria-hidden="true" />
            <span className="brand-motion__corner brand-motion__corner--br" aria-hidden="true" />
            <div className="brand-motion__scan" aria-hidden="true" />

            <div
              role="button"
              tabIndex={0}
              className="brand-motion__hitarea"
              onClick={togglePlay}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  togglePlay()
                }
              }}
              aria-label={paused ? 'Play brand film' : 'Pause brand film'}
            >
              <video
                ref={videoRef}
                className="brand-motion__video"
                poster={poster}
                muted={muted}
                playsInline
                loop
                preload="metadata"
                onLoadedData={() => {
                  setReady(true)
                  setMediaError(false)
                }}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => {
                  setPaused(false)
                  setMediaError(false)
                }}
                onPause={() => setPaused(true)}
                onError={() => setMediaError(true)}
              >
                {sources.map((source) => (
                  <source key={source.src} src={source.src} type={source.type} />
                ))}
              </video>
            </div>

            {!ready && !mediaError && (
              <div className="brand-motion__loader" aria-hidden="true">
                <span className="brand-motion__loader-ring" />
              </div>
            )}

            {mediaError && poster && (
              <div className="brand-motion__fallback" role="status">
                <img
                  className="brand-motion__fallback-img"
                  src={poster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="brand-motion__fallback-panel">
                  <p className="brand-motion__fallback-title">{fallbackTitle}</p>
                  <p className="brand-motion__fallback-msg">{fallbackMessage}</p>
                  <button
                    type="button"
                    className="brand-motion__fallback-btn"
                    onClick={(event) => {
                      event.stopPropagation()
                      retryMedia()
                    }}
                  >
                    <Play size={16} aria-hidden="true" />
                    Play brand film
                  </button>
                </div>
              </div>
            )}

            {showCenterPlay && !mediaError && (
              <span className="brand-motion__center-play" aria-hidden="true">
                <Play size={32} strokeWidth={2} />
              </span>
            )}

            {isFullscreen && (
              <button
                type="button"
                className="brand-motion__exit-fs"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleFullscreen()
                }}
                aria-label="Exit full screen"
              >
                <Minimize2 size={16} aria-hidden="true" />
                <span>Exit full screen</span>
              </button>
            )}

            {shareOpen && (
              <button
                type="button"
                className="brand-motion__share-backdrop"
                aria-label="Close share menu"
                onClick={(event) => {
                  event.stopPropagation()
                  setShareOpen(false)
                  setShareFeedback(null)
                }}
              />
            )}

            <BrandFilmShareSheet
              open={shareOpen}
              onClose={() => {
                setShareOpen(false)
                setShareFeedback(null)
              }}
              title={title || 'TOPBAR in Motion'}
              shareText={DEFAULT_SHARE_TEXT}
              shareUrl={getBrandFilmShareUrl()}
              sheetLabel="Share film"
              placement="video"
              feedback={shareFeedback}
              onFeedback={setShareFeedback}
            />

            <div className="brand-motion__overlay">
              {isPlaying && !isFullscreen && (
                <span className="brand-motion__live">
                  <span className="brand-motion__live-dot" />
                  Now playing
                </span>
              )}
              <div className="brand-motion__controls">
                <button
                  type="button"
                  className="brand-motion__control-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    togglePlay()
                  }}
                  aria-label={paused ? 'Play video' : 'Pause video'}
                >
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                </button>
                <button
                  type="button"
                  className="brand-motion__control-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleMute()
                  }}
                  aria-label={muted ? 'Unmute video' : 'Mute video'}
                >
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  type="button"
                  className={`brand-motion__control-btn${shareOpen ? ' brand-motion__control-btn--active' : ''}`}
                  onClick={toggleShareSheet}
                  aria-expanded={shareOpen}
                  aria-haspopup="dialog"
                  aria-label={shareOpen ? 'Close share menu' : 'Share brand film'}
                >
                  <Share2 size={18} />
                </button>
                <button
                  type="button"
                  className="brand-motion__control-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    toggleFullscreen()
                  }}
                  aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>

            <div
              className="brand-motion__progress"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Video progress"
            >
              <span className="brand-motion__progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {statItems.length > 0 && (
            <div className="brand-motion__deck">
              <div className="brand-motion__deck-grid">
                <ul className="brand-motion__highlights">
                  {statItems.map((item, index) => {
                    const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length]
                    const statKey = `${item.label}-${item.target ?? item.value}`
                    return (
                      <li
                        key={statKey}
                        className="brand-motion__highlight"
                        style={{ '--highlight-i': index }}
                      >
                        <article className="brand-motion__highlight-card">
                          <span className="brand-motion__highlight-orbit" aria-hidden="true" />
                          <span className="brand-motion__highlight-shine" aria-hidden="true" />
                          <span className="brand-motion__highlight-icon" aria-hidden="true">
                            <Icon size={22} strokeWidth={1.75} />
                          </span>
                          <div className="brand-motion__highlight-body">
                            <span className="brand-motion__highlight-value">
                              {typeof item.target === 'number' ? (
                                <BrandMotionStatValue
                                  target={item.target}
                                  suffix={item.suffix}
                                  inView={inView}
                                  reduceMotion={reduceMotion}
                                />
                              ) : (
                                item.value
                              )}
                            </span>
                            <span className="brand-motion__highlight-label">{item.label}</span>
                            {item.desc && (
                              <p className="brand-motion__highlight-desc">{item.desc}</p>
                            )}
                          </div>
                        </article>
                      </li>
                    )
                  })}
                </ul>

                {ctaLabel && ctaLink && (
                  <article className="brand-motion__cta-card">
                    <span className="brand-motion__highlight-orbit" aria-hidden="true" />
                    <span className="brand-motion__highlight-shine" aria-hidden="true" />
                    {ctaTagline && (
                      <div className="brand-motion__cta-lead">
                        <span className="brand-motion__highlight-icon brand-motion__cta-card-icon" aria-hidden="true">
                          <Compass size={22} strokeWidth={1.75} />
                        </span>
                        <p className="brand-motion__cta-tagline">{ctaTagline}</p>
                      </div>
                    )}
                    <Link to={ctaLink} className="brand-motion__cta">
                      <span className="brand-motion__cta-text">{ctaLabel}</span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </article>
                )}
              </div>
            </div>
          )}

          {statItems.length === 0 && ctaLabel && ctaLink && (
            <div className="brand-motion__cta-wrap">
              <Link to={ctaLink} className="brand-motion__cta">
                {ctaLabel}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeBrandVideo
