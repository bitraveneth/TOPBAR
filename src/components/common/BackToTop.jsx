/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useEffect, useState } from 'react'

const ARROW_SRC = '/assets/images/back-to-top-arrow.png'
const SHOW_AFTER_PX = 360

function scrollToTopSmooth() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onClick = useCallback(() => {
    scrollToTopSmooth()
  }, [])

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' back-to-top--visible' : ''}`}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      aria-label="Back to top"
      title="Back to top"
    >
      <span className="back-to-top__inner">
        <img
          src={ARROW_SRC}
          alt=""
          width={44}
          height={44}
          className="back-to-top__arrow"
          loading="eager"
          fetchPriority="low"
          decoding="async"
        />
        <span className="back-to-top__label">Top</span>
      </span>
    </button>
  )
}

export default BackToTop
