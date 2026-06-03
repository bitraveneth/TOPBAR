/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Cpu, Shield, Zap, Award, Rocket, Sparkles, ShieldCheck } from 'lucide-react'

const aboutHeroSlides = [
  '/images/hero/topbar-hero-40000-puffs.webp',
  '/images/hero/topbar-hero-ice.webp',
  '/images/hero/topbar-hero-volcano.webp',
  '/images/hero/topbar-60000-hero-2.webp',
  '/images/hero/topbar-60000-hero-3.webp',
  '/images/hero/topbar-60000-hero-4.webp',
]

const features = [
  {
    icon: Shield,
    title: 'IP68 Tri-Proof',
    desc: 'Industry-leading waterproof, shockproof, and dustproof protection across our flagship product lines.',
  },
  {
    icon: Cpu,
    title: 'AS Chip 4.0',
    desc: 'Advanced proprietary chipset delivering precise wattage control, fast firing, and intelligent safety features.',
  },
  {
    icon: Zap,
    title: 'VPU Technology',
    desc: 'Vapor Processing Unit optimizes coil heating curves for consistent flavor and vapor production.',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    desc: 'Every product undergoes rigorous testing and meets international compliance standards before reaching you.',
  },
]

const timelineByYear = {
  2024: [
    {
      month: 'Mar',
      title: 'Regional Ecosystem Summit',
      desc: 'TOPBAR expanded its integrated ecosystem vision to connect product, service, and community experiences.',
      image: '/assets/images/topbar-logo.svg',
    },
    {
      month: 'Jan',
      title: 'Platform Upgrade',
      desc: 'Core product platform received a major architecture refresh focused on reliability and serviceability.',
      image: '/assets/images/wenax-q2.svg',
    },
  ],
  2023: [
    {
      month: 'Dec',
      title: 'TOPBAR Care ECO GO Green',
      desc: 'Industry-first global carbon-neutral initiative, reflecting our long-term commitment to sustainability.',
      image: '/assets/images/aegis-hero-5.svg',
    },
    {
      month: 'Oct',
      title: 'ARMOUR MAX | S',
      desc: 'Built for demanding outdoor scenarios, this release marked a major leap in practical performance design.',
      image: '/assets/images/legend-5.svg',
    },
    {
      month: 'Sep',
      title: 'Innovation Recognition',
      desc: 'A milestone season that highlighted TOPBAR innovation and product excellence on the global stage.',
      image: '/assets/images/topbar-logo.svg',
    },
    {
      month: 'Jul',
      title: 'ECO NANO',
      desc: 'A cost-effective step forward grounded in eco-friendly thinking and everyday usability.',
      image: '/assets/images/z-nano-3.svg',
    },
  ],
  2022: [
    {
      month: 'Sep',
      title: 'TOPBAR Care Initiative',
      desc: 'Our first global humanitarian campaign focused on real support for the vaper community.',
      image: '/assets/images/topbar-logo.svg',
    },
    {
      month: 'May',
      title: 'Core Technology Breakthrough',
      desc: 'A new performance core improved flavor consistency and lifecycle durability across product lines.',
      image: '/assets/images/wenax-q2.svg',
    },
  ],
}

const purposeItems = [
  {
    title: 'Mission',
    desc: 'Build reliable, high-performance vaping technology that delivers a cleaner, smarter experience every day.',
    tone: 'mission',
    icon: Rocket,
  },
  {
    title: 'Vision',
    desc: 'Become the most trusted global vaping technology brand through safer innovation and long-term user value.',
    tone: 'vision',
    icon: Sparkles,
  },
  {
    title: 'Values',
    desc: 'User trust, product safety, honest craftsmanship, and long-term responsibility guide every decision we make.',
    tone: 'values',
    icon: ShieldCheck,
  },
]

const footprintMarkets = [
  { country: 'Canada', flagCode: 'ca', left: 14, top: 27 },
  { country: 'USA', flagCode: 'us', left: 16, top: 36 },
  { country: 'Dominican Republic', flagCode: 'do', left: 23, top: 45 },
  { country: 'Colombia', flagCode: 'co', left: 21, top: 58 },
  { country: 'Peru', flagCode: 'pe', left: 20, top: 66 },
  { country: 'Chile', flagCode: 'cl', left: 22, top: 76 },
  { country: 'Paraguay', flagCode: 'py', left: 26, top: 70 },
  { country: 'UK', flagCode: 'gb', left: 42, top: 30 },
  { country: 'France', flagCode: 'fr', left: 44, top: 36 },
  { country: 'Spain', flagCode: 'es', left: 41, top: 39 },
  { country: 'Germany', flagCode: 'de', left: 47, top: 34 },
  { country: 'Italy', flagCode: 'it', left: 48, top: 39 },
  { country: 'Norway', flagCode: 'no', left: 46, top: 26 },
  { country: 'Sweden', flagCode: 'se', left: 48, top: 24 },
  { country: 'Poland', flagCode: 'pl', left: 50, top: 33 },
  { country: 'Greece', flagCode: 'gr', left: 50, top: 46 },
  { country: 'Serbia', flagCode: 'rs', left: 47, top: 45 },
  { country: 'Libya', flagCode: 'ly', left: 49, top: 49 },
  { country: 'Egypt', flagCode: 'eg', left: 54, top: 47 },
  { country: 'UAE', flagCode: 'ae', left: 59, top: 46 },
  { country: 'Bahrain', flagCode: 'bh', left: 58, top: 44 },
  { country: 'Saudi Arabia', flagCode: 'sa', left: 57, top: 50 },
  { country: 'Pakistan', flagCode: 'pk', left: 66, top: 42 },
  { country: 'Russia', flagCode: 'ru', left: 63, top: 25 },
  { country: 'China', flagCode: 'cn', left: 74, top: 36, hq: true, label: 'Shenzhen Global Headquarters' },
  { country: 'South Korea', flagCode: 'kr', left: 84, top: 33 },
  { country: 'Philippines', flagCode: 'ph', left: 83, top: 46 },
  { country: 'Malaysia', flagCode: 'my', left: 79, top: 56 },
  { country: 'Indonesia', flagCode: 'id', left: 83, top: 62 },
]

function About() {
  const years = useMemo(() => Object.keys(timelineByYear).sort((a, b) => Number(b) - Number(a)), [])
  const [activeYear, setActiveYear] = useState(years[0])
  const [footprintCounts, setFootprintCounts] = useState({
    centers: 0,
    countries: 0,
    employees: 0,
  })
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)
  const [hasAnimatedFootprint, setHasAnimatedFootprint] = useState(false)
  const footprintRef = useRef(null)
  const activeMilestones = timelineByYear[activeYear] || []

  useEffect(() => {
    const node = footprintRef.current
    if (!node || hasAnimatedFootprint) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHasAnimatedFootprint(true)
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasAnimatedFootprint])

  useEffect(() => {
    if (aboutHeroSlides.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % aboutHeroSlides.length)
    }, 3400)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!hasAnimatedFootprint) return undefined

    const targets = {
      centers: 6,
      countries: 70,
      employees: 8000,
    }

    const duration = 1400
    const start = performance.now()
    let rafId = null

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3

      setFootprintCounts({
        centers: Math.round(targets.centers * eased),
        countries: Math.round(targets.countries * eased),
        employees: Math.round(targets.employees * eased),
      })

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [hasAnimatedFootprint])

  return (
    <>
      <div className="page-hero about-page-hero">
        <div className="about-hero-static">
          <div className="container about-hero-static__content">
            <p className="page-hero__eyebrow">About Us</p>
            <h1>Beyond Ordinary. Engineered by TOPBAR.</h1>
          </div>
          <div className="about-hero-static__product" aria-hidden>
            {aboutHeroSlides.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt=""
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className={`about-hero-static__slide${idx === activeHeroSlide ? ' is-active' : ''}`}
              />
            ))}
            <div className="about-hero-static__dots">
              {aboutHeroSlides.map((_, idx) => (
                <span key={idx} className={`about-hero-static__dot${idx === activeHeroSlide ? ' is-active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="section about-innovation">
        <div className="container">
          <div className="about-innovation__header">
            <h2>Technology That Sets Us Apart</h2>
            <p>
              From chip design to material engineering, every decision is driven by our
              commitment to delivering the best possible experience.
            </p>
          </div>

          <div className="about-innovation__grid">
            {features.map((f) => (
              <article key={f.title} className="about-innovation__card">
                <div className="about-innovation__icon-wrap">
                  <f.icon size={26} className="about-innovation__icon" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>

          <div className="about-innovation__proof" aria-label="TOPBAR technology highlights">
            <span>IP68 Certified</span>
            <span>AS Chip 4.0 Intelligence</span>
            <span>Global QA Standard</span>
          </div>
        </div>
      </section>

      <section className="section about-purpose">
        <div className="container">
          <div className="about-purpose-unified">
            <div className="about-purpose-unified__grid">
              {purposeItems.map((item) => (
                <article key={item.title} className={`about-purpose-unified__item about-purpose-unified__item--${item.tone}`}>
                  <div className="about-purpose-unified__badge" aria-hidden>
                    <item.icon size={30} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section about-legacy">
        <div className="container">
          <div className="about-legacy__head">
            <div>
              <p className="about-legacy__eyebrow">TOPBAR Milestones</p>
              <h2 className="about-legacy__headline">
                The Lasting Legacy,
                <br />
                Inspires Future Greatness
              </h2>
            </div>
            <div className="about-legacy__years" role="tablist" aria-label="Timeline years">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  role="tab"
                  aria-selected={activeYear === year}
                  className={`about-legacy__year-btn${activeYear === year ? ' is-active' : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <p className="about-legacy__active-year">{activeYear}</p>

          <div className="about-legacy__rail" aria-hidden>
            {activeMilestones.map((item) => (
              <div key={`${activeYear}-${item.month}-${item.title}`} className="about-legacy__rail-item">
                <span className="about-legacy__dot" />
                <span className="about-legacy__month">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="about-legacy__grid">
            {activeMilestones.map((item) => (
              <article key={`${activeYear}-${item.title}`} className="about-legacy__card">
                <div className="about-legacy__image-wrap">
                  <img src={item.image} alt={item.title} className="about-legacy__image" loading="lazy" decoding="async" />
                </div>
                <p className="about-legacy__card-month">{item.month}</p>
                <h3>{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-footprint" ref={footprintRef}>
        <div className="container">
          <div className="about-footprint__header">
            <h2>Our Footprint</h2>
            <p>
              We operate in 70+ countries and regions, with 6 manufacturing centers,
              over 8,000 employees.
            </p>
          </div>

          <div className="about-footprint__stats">
            <article className="about-footprint__stat">
              <p className="about-footprint__number">{footprintCounts.centers}+</p>
              <p className="about-footprint__label">manufacturing centers</p>
            </article>
            <article className="about-footprint__stat">
              <p className="about-footprint__number">{footprintCounts.countries}+</p>
              <p className="about-footprint__label">countries & regions</p>
            </article>
            <article className="about-footprint__stat">
              <p className="about-footprint__number">{footprintCounts.employees}+</p>
              <p className="about-footprint__label">employees</p>
            </article>
          </div>

          <div className="about-footprint__map-wrap">
            <img
              src="/assets/images/footprint-map.svg"
              alt="TOPBAR global footprint map"
              className="about-footprint__map"
              loading="lazy"
              decoding="async"
            />
            <div className="about-footprint__markers" aria-hidden>
              {footprintMarkets.map((market, index) => (
                <div
                  key={market.country}
                  className={`about-footprint__marker${market.hq ? ' is-hq' : ''}`}
                  style={{
                    '--x': `${market.left}%`,
                    '--y': `${market.top}%`,
                    '--blink-delay': `${index * 140}ms`,
                  }}
                  title={market.label || market.country}
                >
                  <img
                    src={`https://flagcdn.com/w20/${market.flagCode}.png`}
                    srcSet={`https://flagcdn.com/w40/${market.flagCode}.png 2x`}
                    alt=""
                    className="about-footprint__flag"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default About
