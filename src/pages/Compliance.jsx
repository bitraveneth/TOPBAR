/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { ShieldCheck } from 'lucide-react'

const standards = [
  {
    code: 'PMTA',
    title: 'Premarket Tobacco Product Application',
    desc: 'FDA regulatory pathway for tobacco products marketed in the United States.',
  },
  {
    code: 'TPD',
    title: 'Tobacco Products Directive',
    desc: 'European Union regulation governing the manufacture, presentation, and sale of tobacco and related products.',
  },
  {
    code: 'CRC',
    title: 'Child Resistant Certification',
    desc: 'Safety standard ensuring packaging and devices meet child-resistant requirements.',
  },
  {
    code: 'TGA',
    title: 'Therapeutic Goods Administration',
    desc: 'Australian regulatory framework for nicotine-containing products and therapeutic goods.',
  },
]

function Compliance() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">Trust & Standards</p>
          <h1>Compliance</h1>
          <p>We are committed to meeting and exceeding all regulatory requirements worldwide.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="pill-row" style={{ marginBottom: '2rem' }}>
            {standards.map((s) => (
              <span key={s.code} className="pill">{s.code}</span>
            ))}
          </div>

          <div className="content-grid">
            {standards.map((s) => (
              <div key={s.code} className="content-card">
                <ShieldCheck size={22} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                <h3>{s.code} — {s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="notice" style={{ marginTop: '2rem' }}>
            <h3>Adult Access Policy</h3>
            <p style={{ marginTop: '0.5rem' }}>
              All TOPBAR products are intended for adult use only. Persons under the legal
              smoking/vaping age in their jurisdiction are strictly prohibited from purchasing
              or using our products. We employ age verification measures at all points of sale
              and distribution.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Compliance
