/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useCallback, useEffect, useRef } from 'react'
import { Check, Link2, Share2, Smartphone, X } from 'lucide-react'
import {
  canUseNativeShare,
  copyShareLink,
  openShareChannel,
  SHARE_CHANNELS,
} from '../../lib/brandFilmShare'

function ShareBrandIcon({ name }) {
  const common = { width: 20, height: 20, 'aria-hidden': true }

  switch (name) {
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'messenger':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.13 3.26L19.752 8.1l-6.561 6.863z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.48-1.05 1.16-1.23 1.94-.21.82-.14 1.72.21 2.49.57 1.24 1.9 2.08 3.28 1.95.96-.08 1.92-.5 2.57-1.23.56-.61.9-1.4 1.01-2.22.09-1.75.06-3.5.07-5.25.01-4.07-.01-8.13.02-12.19z" />
        </svg>
      )
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      )
    default:
      return <Link2 size={20} aria-hidden="true" />
  }
}

function BrandFilmShareSheet({
  open,
  onClose,
  title,
  shareText,
  shareUrl,
  sheetLabel = 'Share',
  placement = 'video',
  anchorStyle,
  popoverAbove = false,
  feedback,
  onFeedback,
}) {
  const sheetRef = useRef(null)
  const ctx = { url: shareUrl, title, text: shareText }

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const handleChannel = useCallback(
    async (channel) => {
      const result = openShareChannel(channel, ctx)

      if (result.type === 'copy') {
        try {
          await copyShareLink(shareUrl)
          onFeedback({ type: 'copied', hint: result.hint })
        } catch {
          onFeedback(null)
        }
        return
      }

      if (result.type === 'opened') {
        onFeedback({ type: 'opened', hint: `Opening ${result.label}` })
        onClose()
      }
    },
    [ctx, onClose, onFeedback, shareUrl],
  )

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      })
      onFeedback({ type: 'shared' })
      onClose()
    } catch (error) {
      if (error?.name !== 'AbortError') onFeedback(null)
    }
  }, [onClose, onFeedback, shareText, shareUrl, title])

  if (!open) return null

  return (
    <div
      ref={sheetRef}
      className={`brand-motion__share-sheet brand-motion__share-sheet--${placement}${popoverAbove ? ' brand-motion__share-sheet--above' : ''}`}
      style={anchorStyle || undefined}
      role="dialog"
      aria-label={sheetLabel}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="brand-motion__share-sheet-head">
        <span className="brand-motion__share-sheet-title">
          <Share2 size={16} aria-hidden="true" />
          {sheetLabel}
        </span>
        <button
          type="button"
          className="brand-motion__share-sheet-close"
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
          aria-label="Close share menu"
        >
          <X size={16} />
        </button>
      </div>

      {canUseNativeShare() && (
        <button
          type="button"
          className="brand-motion__share-native"
          onClick={(event) => {
            event.stopPropagation()
            handleNativeShare()
          }}
        >
          <Smartphone size={18} aria-hidden="true" />
          Share via device…
        </button>
      )}

      <ul className="brand-motion__share-grid">
        {SHARE_CHANNELS.map((channel) => (
          <li key={channel.id}>
            <button
              type="button"
              className="brand-motion__share-option"
              style={{ '--share-accent': channel.accent }}
              onClick={(event) => {
                event.stopPropagation()
                handleChannel(channel)
              }}
            >
              <span className="brand-motion__share-option-icon">
                <ShareBrandIcon name={channel.icon} />
              </span>
              <span className="brand-motion__share-option-label">{channel.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {feedback && (
        <p className="brand-motion__share-sheet-hint" role="status">
          {feedback.type === 'copied' && <Check size={14} aria-hidden="true" />}
          {feedback.hint || (feedback.type === 'shared' ? 'Shared' : 'Done')}
        </p>
      )}
    </div>
  )
}

export default BrandFilmShareSheet
