/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState, useEffect, useRef } from 'react'

const stats = [
  { target: 10, suffix: '+', label: 'Years of Innovation' },
  { target: 50, suffix: 'M+', label: 'Users Worldwide' },
  { target: 200, suffix: '+', label: 'Patents Filed' },
]

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    let frame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, start])

  return count
}

function AnimatedStat({ target, suffix, label, inView }) {
  const count = useCountUp(target, 3000, inView)

  return (
    <div className="bv-stat">
      <span className="bv-stat__number">{count}{suffix}</span>
      <span className="bv-stat__label">{label}</span>
    </div>
  )
}

function BrandValues({ values }) {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bv-section">

      <div className="container">
        <div className="bv-layout">
          <div className="bv-left">
            <div className="bv-pills">
              {values.map((v, i) => (
                <button
                  key={v.keyword}
                  className={`bv-pill${active === i ? ' bv-pill--active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="bv-pill__number">0{i + 1}</span>
                  <span className="bv-pill__keyword">{v.keyword}</span>
                </button>
              ))}
            </div>
            <div className="bv-detail">
              <div className="bv-detail__line" />
              <p className="bv-detail__text">{values[active]?.text}</p>
            </div>
          </div>

          <div className="bv-right">
            <h2 className="bv-headline">
              Refine Harder,
              <br />
              <span className="bv-headline__accent">And Never Settle.</span>
            </h2>
            <p className="bv-body">
              Geek knows better isn't just a claim — it's the choice to go deeper,
              refine harder, and never settle. Mastery isn't a skill, it's an attitude.
              One that shapes how we create, how we live, and how we vape.
            </p>
            <div className="bv-stats" ref={statsRef}>
              {stats.map((s) => (
                <AnimatedStat key={s.label} {...s} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandValues
