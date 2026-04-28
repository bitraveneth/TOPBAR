import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

function HeroCarousel({ slides = [] }) {
  const count = slides.length
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)

  const next = useCallback(() => {
    if (count < 1) return
    setCurrent((c) => (c + 1) % count)
  }, [count])
  const prev = useCallback(() => {
    if (count < 1) return
    setCurrent((c) => (c - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (hovering || count < 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, hovering, count])

  useEffect(() => {
    if (count > 0 && current >= count) setCurrent(0)
  }, [count, current])

  if (count < 1) return null

  const slide = slides[current]

  return (
    <section
      className="parallax-hero"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {slides.map((s, i) => (
        <div key={i} className={`parallax-hero__slide${i === current ? ' active' : ''}`}>
          <div className="parallax-hero__img-wrap">
            <img className="parallax-hero__img" src={s.image} alt={s.title} />
          </div>
          <div className="parallax-hero__overlay" />
          <div className="parallax-hero__focus-overlay" />
        </div>
      ))}

      <div className="parallax-hero__content" key={current}>
        <h1 className="parallax-hero__title">{slide?.title}</h1>
        {slide?.subtitle && <p className="parallax-hero__sub">{slide.subtitle}</p>}
        {slide?.cta && (
          <Link to={slide.link || '/products'} className="parallax-hero__cta">
            {slide.cta}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      <button className={`hero-arrow hero-arrow--left${hovering ? ' visible' : ''}`} onClick={prev} aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <button className={`hero-arrow hero-arrow--right${hovering ? ' visible' : ''}`} onClick={next} aria-label="Next">
        <ChevronRight size={24} />
      </button>

      <div className="parallax-hero__indicators">
        {slides.map((_, i) => (
          <div key={i} className={`parallax-hero__indicator${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {!hovering && (
        <div className="parallax-hero__progress">
          <div className="parallax-hero__progress-bar" key={current} />
        </div>
      )}
    </section>
  )
}

export default HeroCarousel
