/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useRef, useState } from 'react'
import { Play } from 'lucide-react'

function HomeBrandVideo({
  title = 'TOPBAR in Motion',
  subtitle = 'Tap play to watch the brand story.',
  poster = '/images/hero/topbar-hero-9900-puffs.webp',
  mp4,
  mov,
}) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const sources = [
    mp4 && { src: mp4, type: 'video/mp4' },
    mov && { src: mov, type: 'video/quicktime' },
  ].filter(Boolean)

  if (!sources.length) return null

  const handlePlay = useCallback(() => {
    setLoadError(false)
    setPlaying(true)
    requestAnimationFrame(() => {
      const video = videoRef.current
      if (!video) return
      video.load()
      video.play().catch(() => setLoadError(true))
    })
  }, [])

  return (
    <section className="section brand-video-section" aria-labelledby="brand-video-heading">
      <div className="container">
        <h2 id="brand-video-heading" className="section-hero-title brand-video-section__title">
          {title}
        </h2>
        {subtitle && <p className="brand-video-section__sub">{subtitle}</p>}

        <div className="brand-video-stage">
          {!playing ? (
            <button
              type="button"
              className="brand-video-poster"
              onClick={handlePlay}
              aria-label="Play brand video"
            >
              <img src={poster} alt="" loading="lazy" decoding="async" />
              <span className="brand-video-poster__shade" aria-hidden="true" />
              <span className="brand-video-poster__play">
                <Play size={28} strokeWidth={2.25} aria-hidden="true" />
                <span>Play video</span>
              </span>
            </button>
          ) : (
            <div className="brand-video-player">
              <video
                ref={videoRef}
                className="brand-video-player__el"
                controls
                playsInline
                preload="auto"
                poster={poster}
                onError={() => setLoadError(true)}
              >
                {sources.map((source) => (
                  <source key={source.src} src={source.src} type={source.type} />
                ))}
              </video>
              {loadError && (
                <p className="brand-video-player__error" role="status">
                  Video could not load. Try again or use a compressed MP4 in{' '}
                  <code>public/videos/</code>.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeBrandVideo
