import { Cpu, Shield, Zap, Award } from 'lucide-react'

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

function About() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Our Brand</h1>
          <p>
            Geek knows better isn't just a claim — it's the choice to go deeper,
            refine harder, and never settle.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: 700, marginInline: 'auto', marginBottom: '3rem' }}>
            <p className="section-eyebrow">Innovation</p>
            <h2>Technology That Sets Us Apart</h2>
            <p style={{ marginInline: 'auto' }}>
              From chip design to material engineering, every decision is driven by our
              commitment to delivering the best possible experience.
            </p>
          </div>

          <div className="content-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {features.map((f) => (
              <div key={f.title} className="content-card">
                <f.icon size={28} style={{ color: 'var(--accent)', marginBottom: '0.75rem' }} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <p className="section-eyebrow">Our Story</p>
          <h2>A Decade of Innovation</h2>
          <p style={{ lineHeight: 1.8, marginTop: '1rem' }}>
            Founded with a passion for technology and quality, TOPBAR has grown from
            a small engineering team to a global brand trusted by millions. Our mission
            is simple: create products that exceed expectations through genuine innovation,
            expert craftsmanship, and an unwavering commitment to what users truly need.
          </p>
          <p style={{ lineHeight: 1.8, marginTop: '1rem' }}>
            Every product we create is the result of thousands of hours of research,
            prototyping, and real-world testing. From our industry-first IP68 tri-proof
            rating to our proprietary AS chipset platform, we continue to push boundaries
            and set new standards for the industry.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-eyebrow">Sustainability</p>
          <h2>Our Commitment</h2>
          <div className="content-grid" style={{ marginTop: '2rem', maxWidth: 900, marginInline: 'auto' }}>
            <div className="content-card">
              <h3>Responsible Manufacturing</h3>
              <p>Reducing environmental impact through efficient production processes and sustainable material sourcing.</p>
            </div>
            <div className="content-card">
              <h3>Recycling Programs</h3>
              <p>Supporting device recycling and proper disposal through our global partner network.</p>
            </div>
            <div className="content-card">
              <h3>Community Impact</h3>
              <p>Investing in local communities and supporting education initiatives worldwide.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
