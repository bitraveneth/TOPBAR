/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import { X } from 'lucide-react'

function FloatingCommunityBadge() {
  const [closed, setClosed] = useState(false)

  if (closed) return null

  return (
    <div className="community-float" aria-label="Topbar community join widget">
      <button
        type="button"
        className="community-float__close"
        onClick={() => setClosed(true)}
        aria-label="Close community widget"
      >
        <X size={18} />
      </button>

      <div className="community-float__badge" role="img" aria-label="Topbar community join now badge">
        <svg className="community-float__ring-svg" viewBox="0 0 160 160" aria-hidden>
          <defs>
            <path
              id="communityRingPath"
              d="M80,80 m-63,0 a63,63 0 1,1 126,0 a63,63 0 1,1 -126,0"
            />
          </defs>
          <text className="community-float__ring-text">
            <textPath href="#communityRingPath" startOffset="50%" textAnchor="middle">
              TOP BAR COMMUNITY • TOP BAR COMMUNITY • TOP BAR COMMUNITY •
            </textPath>
          </text>
        </svg>
        <img
          className="community-float__arrow-img"
          src="/assets/images/community-arrow.png"
          alt=""
          aria-hidden
        />
        <span className="community-float__cta">JOIN NOW</span>
      </div>
    </div>
  )
}

export default FloatingCommunityBadge
