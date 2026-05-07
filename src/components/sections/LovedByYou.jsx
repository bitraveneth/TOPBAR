/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import { useCms } from '../../contexts/CmsContext'

function Ribbon({ text }) {
  return (
    <div className="loved-header">
      <div className="loved-checker" />
      <h1 className="loved-title">{text}</h1>
      <div className="loved-checker" />
    </div>
  )
}

function LovedByYou() {
  const { merged } = useCms()
  const loved = merged.home?.lovedByYou || { ribbons: [], items: [] }
  const ribbons = loved.ribbons?.length ? loved.ribbons : ['Real Reviews', 'Join The Movement']
  const items = loved.items || []
  const doubled = items.length > 0 ? [...items, ...items] : []
  const [hovered, setHovered] = useState(false)

  if (doubled.length === 0) return null

  return (
    <section className="loved-section">
      <Ribbon text={ribbons[0]} />
      <div
        className={`loved-track-wrapper${hovered ? ' paused' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="loved-track">
          {doubled.map((item, i) => (
            <div key={i} className="loved-card">
              <img src={item.img} alt={item.author} loading="lazy" />
              <div className="loved-card__overlay">
                <p className="loved-card__quote">"{item.text}"</p>
                <span className="loved-card__author">— {item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Ribbon text={ribbons[1] ?? ribbons[0]} />
    </section>
  )
}

export default LovedByYou
