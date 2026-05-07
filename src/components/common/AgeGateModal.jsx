/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'

const STORAGE_KEY = 'topbar-age-verified'

function readInitialStatus() {
  if (typeof window === 'undefined') return 'hidden'
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY)
    if (value === 'verified') return 'hidden'
    if (value === 'denied') return 'denied'
  } catch {
    // sessionStorage may be unavailable (private mode, SSR, etc.) — fall through to prompt.
  }
  return 'prompt'
}

function AgeGateModal() {
  const [status, setStatus] = useState(readInitialStatus)
  const confirmButtonRef = useRef(null)

  const isVisible = status === 'prompt' || status === 'denied'

  useEffect(() => {
    if (!isVisible) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const blockEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener('keydown', blockEscape, true)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', blockEscape, true)
    }
  }, [isVisible])

  useEffect(() => {
    if ((status === 'prompt' || status === 'denied') && confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    }
  }, [status])

  const handleConfirm = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, 'verified')
    } catch {
      // Persisting is best-effort; still hide for this render.
    }
    setStatus('hidden')
  }

  const handleDecline = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, 'denied')
    } catch {
      // Persisting is best-effort; still show denied view.
    }
    setStatus('denied')
  }

  if (!isVisible) return null

  return (
    <div
      className="age-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="age-gate__backdrop" aria-hidden="true" />

      {status === 'prompt' ? (
        <div className="age-gate__panel">
          <img
            src="/images/topbar-logo.png"
            alt="TOPBAR"
            className="age-gate__logo"
          />

          <p className="age-gate__eyebrow">Age Verification</p>
          <h2 id="age-gate-title" className="age-gate__title">
            Welcome to TOPBAR
          </h2>

          <p className="age-gate__lede">
            You must be 21 or older to enter this website.
          </p>

          <p className="age-gate__warning">
            Nicotine is addictive. For adult use only.
          </p>

          <div className="age-gate__actions">
            <button
              ref={confirmButtonRef}
              type="button"
              className="age-gate__btn age-gate__btn--primary"
              onClick={handleConfirm}
            >
              I am 21+
            </button>
            <button
              type="button"
              className="age-gate__btn age-gate__btn--secondary"
              onClick={handleDecline}
            >
              Exit
            </button>
          </div>
        </div>
      ) : (
        <div className="age-gate__panel age-gate__panel--denied">
          <span className="age-gate__lock" aria-hidden="true">
            <Lock size={32} strokeWidth={2} />
          </span>
          <h2 id="age-gate-title" className="age-gate__title">
            Access Denied
          </h2>
          <p className="age-gate__lede">
            You are not allowed to view this website.
          </p>
          <p className="age-gate__hint">
            Clicked Exit by mistake? Confirm you are 21+ to continue.
          </p>

          <div className="age-gate__actions age-gate__actions--single">
            <button
              ref={confirmButtonRef}
              type="button"
              className="age-gate__btn age-gate__btn--primary"
              onClick={handleConfirm}
            >
              I am 21+
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgeGateModal
