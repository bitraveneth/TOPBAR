import { Check } from 'lucide-react'

const row1 = ['POWERFUL', 'LEGENDARY', 'TRI-PROOF', 'INNOVATIVE', 'UNSTOPPABLE', 'PREMIUM']
const row2 = ['FLAVOR KING', 'IP68 RATED', 'VPU INSIDE', 'BUILT TO ENDURE', 'GEEK KNOWS BETTER', '200W POWER']

const badges = [
  { text: 'Tri-Proof Protection', color: '#CCFF00', x: '3%',  y: '10%', rotate: -5, delay: 0 },
  { text: 'VPU Inside',          color: '#FF6B9D', x: '30%', y: '22%', rotate: 3,  delay: 0.7 },
  { text: '200W Raw Power',      color: '#FF8C42', x: '65%', y: '6%',  rotate: -3, delay: 1.4 },
  { text: 'Flavor Maximized',    color: '#FFD700', x: '45%', y: '72%', rotate: 4,  delay: 2.1 },
  { text: 'Built to Endure',     color: '#FF4D6A', x: '76%', y: '70%', rotate: -2, delay: 0.3 },
  { text: 'Leak-Proof Design',   color: '#B47CFF', x: '8%',  y: '68%', rotate: 3,  delay: 1 },
  { text: 'One Coil Per Flavor', color: '#FF8C42', x: '52%', y: '38%', rotate: -4, delay: 1.8 },
  { text: 'IP68 Certified',      color: '#CCFF00', x: '85%', y: '35%', rotate: 2,  delay: 0.5 },
]

function ScrollRow({ words, direction = 'left', accent = false }) {
  const doubled = [...words, ...words]
  return (
    <div className={`funky-track funky-track--${direction}`}>
      <div className="funky-track__inner">
        {doubled.map((word, i) => (
          <span key={i} className={`funky-word${accent && i % 3 === 0 ? ' funky-word--accent' : ''}`}>
            {word}
            <span className="funky-sep">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function FunkyBanner() {
  return (
    <section className="funky-section">
      <div className="funky-dots" />

      <div className="funky-glow funky-glow--1" />
      <div className="funky-glow funky-glow--2" />

      {badges.map((badge) => (
        <div
          key={badge.text}
          className="funky-badge"
          style={{
            '--badge-color': badge.color,
            '--badge-x': badge.x,
            '--badge-y': badge.y,
            '--badge-rotate': `${badge.rotate}deg`,
            '--badge-delay': `${badge.delay}s`,
          }}
        >
          <span>{badge.text}</span>
          <span className="funky-badge__icon">
            <Check size={13} strokeWidth={3} />
          </span>
        </div>
      ))}

      <div className="funky-scroll-area">
        <ScrollRow words={row1} direction="left" accent />
        <ScrollRow words={row2} direction="right" />
      </div>
    </section>
  )
}

export default FunkyBanner
