import { useState } from 'react'

const items = [
  { img: '/images/community/community-2.png', text: 'Build quality feels solid and premium in the hand.', author: 'Tech Reviewer' },
  { img: '/images/community/community-3.png', text: 'Sleek design, really stylish to carry around.', author: 'Style Enthusiast' },
  { img: '/images/community/community-4.png', text: 'Perfect for a relaxing evening — smooth and flavorful.', author: 'Flavor Chaser' },
  { img: '/images/community/community-5.png', text: 'Battery life easily lasts me the whole day.', author: 'Daily User' },
  { img: '/images/community/community-2.png', text: 'Loved the vibe and packaging — feels premium from the moment you get it.', author: 'First-Time Buyer' },
  { img: '/images/community/community-3.png', text: 'Powerful hits every time — solid and consistent performance.', author: 'Power User' },
  { img: '/images/community/community-4.png', text: 'Compact and lightweight, perfect for on-the-go.', author: 'Traveler' },
  { img: '/images/community/community-5.png', text: 'Produces plenty of vapor with strong satisfaction.', author: 'Cloud Enthusiast' },
]

const doubled = [...items, ...items]

function Ribbon({ text, variant = 'primary' }) {
  return (
    <div className={`loved-header loved-header--${variant}`}>
      <div className="loved-checker" />
      <h1 className="loved-title">{text}</h1>
      <div className="loved-checker" />
    </div>
  )
}

function LovedByYou() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="loved-section">
      <Ribbon text="Real Reviews" variant="primary" />
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
      <Ribbon text="Join The Movement" variant="secondary" />
    </section>
  )
}

export default LovedByYou
