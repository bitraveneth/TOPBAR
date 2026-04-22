import { useMemo, useState } from 'react'

function TopbarScrollZoom() {
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [isHovering, setIsHovering] = useState(false)
  const text = 'TOP BAR'
  const letters = useMemo(() => [...text], [text])
  const interactiveCount = letters.filter((ch) => ch !== ' ').length

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const clamped = Math.min(0.999, Math.max(0, x))
    const letterOrder = Math.floor(clamped * interactiveCount)
    let count = 0
    let active = -1
    for (let i = 0; i < letters.length; i += 1) {
      if (letters[i] === ' ') continue
      if (count === letterOrder) {
        active = i
        break
      }
      count += 1
    }
    setHoverIndex(active)
  }

  return (
    <section
      className={`topbar-zoom-section${isHovering ? ' is-hovering' : ''}`}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setHoverIndex(-1)
      }}
    >
      <div className="topbar-zoom-sticky">
        <div className="topbar-zoom-text-wrap">
          <h2 className="topbar-zoom-text" aria-label={text}>
            {letters.map((char, i) => (
              <span
                key={`${char}-${i}`}
                className={[
                  'topbar-letter',
                  char === ' ' ? 'is-space' : '',
                  hoverIndex === i ? 'is-active' : '',
                  hoverIndex !== -1 && Math.abs(hoverIndex - i) === 1 ? 'is-near-1' : '',
                  hoverIndex !== -1 && Math.abs(hoverIndex - i) === 2 ? 'is-near-2' : '',
                ].join(' ').trim()}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  )
}

export default TopbarScrollZoom
