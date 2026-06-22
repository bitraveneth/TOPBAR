/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { heroImageProps } from '../../lib/responsiveImage'
import { getHeroSlideCopy } from '../../lib/heroSlideCopy'

const SWIPE_THRESHOLD = 40

function HeroCarousel({ slides = [] }) {
  const count = slides.length
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [isMobileHero, setIsMobileHero] = useState(false)
  const [readyImages, setReadyImages] = useState(() => new Set())
  const progressRef = useRef(null)
  const contentRef = useRef(null)
  const preloadedRef = useRef(new Set())
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const safeCurrent = count > 0 ? current % count : 0
  const slide = slides[safeCurrent] || slides[0]
  const heroCopy = getHeroSlideCopy(slide, isMobileHero)
  const heroImage = heroImageProps(slide?.image)
  const imageReady = Boolean(slide?.image && readyImages.has(slide.image))
  const slideInterval = isMobileHero ? 6000 : 5000

  const markImageReady = useCallback((url) => {
    if (!url) return
    setReadyImages((currentSet) => {
      if (currentSet.has(url)) return currentSet
      const next = new Set(currentSet)
      next.add(url)
      return next
    })
  }, [])

  useEffect(() => {
    slides.forEach((item) => {
      if (!item?.image || preloadedRef.current.has(item.image)) return
      preloadedRef.current.add(item.image)
      const preloadSrc = heroImageProps(item.image).src || item.image
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => markImageReady(item.image)
      img.onerror = () => markImageReady(item.image)
      img.src = preloadSrc
    })
  }, [slides, markImageReady])

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
    const timer = setInterval(next, slideInterval)
    return () => clearInterval(timer)
  }, [next, hovering, count, slideInterval])

  useLayoutEffect(() => {
    const bar = progressRef.current
    if (bar) {
      bar.style.animation = 'none'
      void bar.offsetWidth
      bar.style.removeProperty('animation')
    }

    const root = contentRef.current
    if (!root) return
    root.querySelectorAll('.parallax-hero__tag, .parallax-hero__title, .parallax-hero__sub, .parallax-hero__cta').forEach((element) => {
      element.style.animation = 'none'
      void element.offsetWidth
      element.style.removeProperty('animation')
    })
  }, [safeCurrent, slideInterval])

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

  const handleImageLoad = () => {
    markImageReady(slide?.image)
  }

  return (
    <section
      className={`parallax-hero${isMobileHero ? ' parallax-hero--mobile' : ''}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="parallax-hero__slide active">
        <div className="parallax-hero__img-wrap">
          {!imageReady && <div className="parallax-hero__img-placeholder" aria-hidden="true" />}
          <img
            className={`parallax-hero__img${imageReady ? ' is-ready' : ''}`}
            src={heroImage.src || slide.image}
            srcSet={heroImage.srcSet}
            sizes={heroImage.sizes}
            alt={heroCopy.title || slide.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={handleImageLoad}
          />
        </div>
        <div className="parallax-hero__overlay" />
        <div className="parallax-hero__focus-overlay" />
      </div>

      <div className="parallax-hero__content" ref={contentRef} data-slide={safeCurrent}>
        {isMobileHero && heroCopy.tag ? (
          <p className="parallax-hero__tag">{heroCopy.tag}</p>
        ) : null}
        <h1 className="parallax-hero__title">{heroCopy.title}</h1>
        {heroCopy.subtitle && <p className="parallax-hero__sub">{heroCopy.subtitle}</p>}
        {heroCopy.cta && (
          <Link to={slide.link || '/products'} className="parallax-hero__cta">
            {heroCopy.cta}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <button
        type="button"
        className={`hero-arrow hero-arrow--left${isMobileHero || hovering ? ' visible' : ''}`}
        onClick={prev}
        onTouchStart={(event) => event.stopPropagation()}
        onTouchEnd={(event) => event.stopPropagation()}
        aria-label="Previous slide"
      >
        <ChevronLeft size={isMobileHero ? 18 : 24} />
      </button>
      <button
        type="button"
        className={`hero-arrow hero-arrow--right${isMobileHero || hovering ? ' visible' : ''}`}
        onClick={next}
        onTouchStart={(event) => event.stopPropagation()}
        onTouchEnd={(event) => event.stopPropagation()}
        aria-label="Next slide"
      >
        <ChevronRight size={isMobileHero ? 18 : 24} />
      </button>

      <div className="parallax-hero__indicators">
        {slides.map((item, i) => (
          <button
            key={item.image || `hero-dot-${i}`}
            type="button"
            className={`parallax-hero__indicator${i === safeCurrent ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {!isMobileHero && !hovering && (
        <div className="parallax-hero__progress">
          <div
            ref={progressRef}
            className="parallax-hero__progress-bar"
            style={{ animationDuration: `${slideInterval}ms` }}
          />
        </div>
      )}
    </section>
  )
}

export default HeroCarousel
