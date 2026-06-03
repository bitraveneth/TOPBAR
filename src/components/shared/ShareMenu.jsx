/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Share2 } from 'lucide-react'
import { getSharePopoverAnchor } from '../../lib/sharePopoverAnchor'
import BrandFilmShareSheet from '../sections/BrandFilmShareSheet'

function ShareMenu({
  title,
  shareText,
  shareUrl,
  triggerLabel = 'Share',
  sheetLabel = 'Share',
  placement = 'inline',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [feedback, setShareFeedback] = useState(null)
  const [popoverAnchor, setPopoverAnchor] = useState(null)
  const [popoverFlip, setPopoverFlip] = useState(false)
  const menuRef = useRef(null)
  const usePortal = placement === 'page' || placement === 'popover'

  const updatePopoverAnchor = useCallback(() => {
    if (!menuRef.current) return
    const anchor = getSharePopoverAnchor(menuRef.current.getBoundingClientRect())
    setPopoverAnchor(anchor.style)
    setPopoverFlip(anchor.flipAbove)
  }, [])

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setShareFeedback(null), 2800)
    return () => window.clearTimeout(timer)
  }, [feedback])

  useEffect(() => {
    if (!open || placement !== 'page') return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, placement])

  useLayoutEffect(() => {
    if (!open || placement !== 'popover') return undefined
    updatePopoverAnchor()
    const onReposition = () => updatePopoverAnchor()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, placement, updatePopoverAnchor])

  const close = useCallback(() => {
    setOpen(false)
    setShareFeedback(null)
    setPopoverAnchor(null)
    setPopoverFlip(false)
  }, [])

  const toggle = useCallback(() => {
    setOpen((value) => {
      const next = !value
      if (!next) {
        setShareFeedback(null)
        setPopoverAnchor(null)
        setPopoverFlip(false)
      } else if (placement === 'popover') {
        requestAnimationFrame(updatePopoverAnchor)
      }
      return next
    })
  }, [placement, updatePopoverAnchor])

  const backdropClass =
    placement === 'video'
      ? ' share-menu__backdrop--video'
      : placement === 'popover'
        ? ' share-menu__backdrop--popover'
        : ' share-menu__backdrop--page'

  const backdrop = open ? (
    <button
      type="button"
      className={`share-menu__backdrop${backdropClass}`}
      aria-label="Close share menu"
      onClick={close}
    />
  ) : null

  const sheet = (
    <BrandFilmShareSheet
      open={open}
      onClose={close}
      title={title}
      shareText={shareText}
      shareUrl={shareUrl}
      sheetLabel={sheetLabel}
      placement={placement}
      anchorStyle={placement === 'popover' ? popoverAnchor : undefined}
      popoverAbove={placement === 'popover' && popoverFlip}
      feedback={feedback}
      onFeedback={setShareFeedback}
    />
  )

  return (
    <div
      ref={menuRef}
      className={`share-menu share-menu--${placement}${open ? ' share-menu--open' : ''}${className ? ` ${className}` : ''}`}
    >
      {!usePortal && backdrop}

      <button
        type="button"
        className={`share-menu__trigger${open ? ' share-menu__trigger--active' : ''}`}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? 'Close share menu' : triggerLabel}
      >
        <Share2 size={18} aria-hidden="true" />
        <span className="share-menu__trigger-label">{triggerLabel}</span>
      </button>

      {usePortal && open
        ? createPortal(
            <>
              {backdrop}
              {sheet}
            </>,
            document.body,
          )
        : sheet}
    </div>
  )
}

export default ShareMenu
