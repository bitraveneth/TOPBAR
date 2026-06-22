/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCms } from '../../contexts/useCms'
import LovedRibbon from '../common/LovedRibbon'

function shuffleItems(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function LovedByYou() {
  const { merged } = useCms()
  const loved = merged.home?.lovedByYou || { ribbons: [], items: [] }
  const ribbons = loved.ribbons?.length ? loved.ribbons : ['Real Reviews', 'Join The Movement']
  const items = useMemo(() => {
    const seen = new Set()
    const unique = (loved.items || []).filter((item) => {
      const img = item?.img
      if (!img || seen.has(img)) return false
      seen.add(img)
      return true
    })
    return shuffleItems(unique)
  }, [loved.items])
  const trackRef = useRef(null)
  const wrapperRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const track = trackRef.current
    const wrapper = wrapperRef.current
    if (!track || !wrapper) return undefined

    const sync = () => {
      const distance = Math.max(0, track.scrollWidth - wrapper.clientWidth)
      track.style.setProperty('--loved-scroll-distance', distance > 0 ? `-${distance}px` : '0px')
      setCanScroll(distance > 0)
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(track)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <section className="loved-section">
      <LovedRibbon text={ribbons[0]} />
      <div
        ref={wrapperRef}
        className={`loved-track-wrapper${hovered ? ' paused' : ''}${canScroll ? '' : ' loved-track-wrapper--static'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div ref={trackRef} className="loved-track">
          {items.map((item) => (
            <div key={item.img} className="loved-card">
              <img src={item.img} alt={item.author} loading="lazy" decoding="async" />
              <div className="loved-card__overlay">
                <p className="loved-card__quote">"{item.text}"</p>
                <span className="loved-card__author">— {item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LovedRibbon text={ribbons[1] ?? ribbons[0]} />
    </section>
  )
}

export default LovedByYou
