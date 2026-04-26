import { useState } from 'react'

const items = [
  {
    img: '/images/community/community-2.png',
    text: "TOPBAR's Type-C top-up is fast and drama-free—I'm never caught off guard before a night out.",
    author: 'City Commuter',
  },
  {
    img: '/images/community/community-3.png',
    text: 'The 1.0Ω mesh hit is smooth and consistent. Flavor comes through clean, puff after puff.',
    author: 'Flavor Purist',
  },
  {
    img: '/images/community/community-4.png',
    text: "500mAh in this size still feels all-day. The digital readout is so clear I actually check it.",
    author: 'Weekend Hiker',
  },
  {
    img: '/images/community/community-5.png',
    text: "No leaks in the bag, no stress on the go—the anti-leak build is what won me over.",
    author: 'On-The-Go Pro',
  },
  {
    img: '/images/community/community-2.png',
    text: "Screen, battery, liquid—glance and go. It feels more premium than most disposables I've tried.",
    author: 'Design Snob',
  },
  {
    img: '/images/community/community-3.png',
    text: "9900+ puffs and the flavor line keeps me trying new options. TOPBAR doesn't feel like a one-note brand.",
    author: 'Sampler',
  },
  {
    img: '/images/community/community-4.png',
    text: "Charge. Draw. Move on. Simple rhythm—and the bold yellow aesthetic matches the energy.",
    author: 'Music Crew',
  },
  {
    img: '/images/community/community-5.png',
    text: "I'm here for the movement: better tech, real transparency on what's left, and zero messy surprises.",
    author: 'Joiner',
  },
]

const doubled = [...items, ...items]

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
  const [hovered, setHovered] = useState(false)

  return (
    <section className="loved-section">
      <Ribbon text="Real Reviews" />
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
      <Ribbon text="Join The Movement" />
    </section>
  )
}

export default LovedByYou
