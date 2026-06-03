const SHEET_WIDTH = 280
const SHEET_MIN_HEIGHT = 260

/**
 * Position a fixed share popover under (or above) the trigger, aligned to its right edge.
 */
export function getSharePopoverAnchor(rect) {
  const gap = 10
  const pad = 12
  const viewportH = window.innerHeight
  const viewportW = window.innerWidth
  const spaceBelow = viewportH - rect.bottom - gap - pad
  const spaceAbove = rect.top - gap - pad
  const openAbove = spaceBelow < SHEET_MIN_HEIGHT && spaceAbove > spaceBelow

  let top = openAbove ? rect.top - gap : rect.bottom + gap
  let transform = openAbove ? 'translateY(-100%)' : 'none'

  let right = viewportW - rect.right
  const maxRight = viewportW - pad - SHEET_WIDTH
  right = Math.min(Math.max(right, pad), maxRight)

  const maxHeight = Math.min(
    520,
    viewportH * 0.72,
    Math.max(160, openAbove ? spaceAbove : spaceBelow),
  )

  return {
    style: {
      top: `${top}px`,
      right: `${right}px`,
      transform,
      maxHeight: `${maxHeight}px`,
    },
    flipAbove: openAbove,
  }
}
