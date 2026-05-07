/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const SWIPE_THRESHOLD = 40

function HeroCarousel({ slides = [] }) {
  const count = slides.length
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [isMobileHero, setIsMobileHero] = useState(false)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobileHero(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const next = useCallback(() => {
    if (count < 1) return
    setCurrent((c) => (c + 1) % count)
  }, [count])
  const prev = useCallback(() => {
    if (count < 1) return
    setCurrent((c) => (c - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (hovering || count < 1) return undefined
    const interval = isMobileHero ? 6000 : 5000
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [next, hovering, count, isMobileHero])

  useEffect(() => {
    if (count > 0 && current >= count) setCurrent(0)
  }, [count, current])

  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current == null) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartX.current
    const deltaY = touch.clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return
    if (Math.abs(deltaX) < Math.abs(deltaY)) return
    if (deltaX < 0) next()
    else prev()
  }

  if (count < 1) return null

  const slide = slides[current]

  return (
    <section
      className="parallax-hero"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div key={current} className="parallax-hero__slide active">
        <div className="parallax-hero__img-wrap">
          <img
            className="parallax-hero__img"
            src={slide.image}
            alt={slide.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="parallax-hero__overlay" />
        <div className="parallax-hero__focus-overlay" />
      </div>

      <div className="parallax-hero__content" key={current}>
        <h1 className="parallax-hero__title">{slide?.title}</h1>
        {slide?.subtitle && <p className="parallax-hero__sub">{slide.subtitle}</p>}
        {slide?.cta && (
          <Link to="/products" className="parallax-hero__cta">
            {slide.cta}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {!isMobileHero && (
        <>
          <button className={`hero-arrow hero-arrow--left${hovering ? ' visible' : ''}`} onClick={prev} aria-label="Previous">
            <ChevronLeft size={24} />
          </button>
          <button className={`hero-arrow hero-arrow--right${hovering ? ' visible' : ''}`} onClick={next} aria-label="Next">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="parallax-hero__indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`parallax-hero__indicator${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {!isMobileHero && !hovering && (
        <div className="parallax-hero__progress">
          <div className="parallax-hero__progress-bar" key={current} />
        </div>
      )}
    </section>
  )
}

export default HeroCarousel
