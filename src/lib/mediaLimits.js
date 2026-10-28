/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export const IMAGE_MAX_BYTES = 1024 * 1024
export const VIDEO_MAX_BYTES = 20 * 1024 * 1024
export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024

export function fileKind(file) {
  const type = file?.type || file?.mimetype || ''
  const name = file?.name || file?.originalname || ''
  if (type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(name)) return 'image'
  if (type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(name)) return 'video'
  return 'document'
}

export function mediaSizeError(file) {
  const size = file?.size || 0
  const kind = fileKind(file)
  if (kind === 'image' && size > IMAGE_MAX_BYTES) {
    return 'Images must be under 1 MB. A larger image makes the website slow.'
  }
  if (kind === 'video' && size > VIDEO_MAX_BYTES) {
    return 'Videos must be under 20 MB.'
  }
  if (kind === 'document' && size > DOCUMENT_MAX_BYTES) {
    return 'Documents must be under 10 MB.'
  }
  return ''
}

export function limitHint(accept = '') {
  const image = /image/i.test(accept)
  const video = /video/i.test(accept)
  const doc = /pdf|zip|text\/plain/i.test(accept)
  if (image && video) return 'Images must be under 1 MB. Videos must be under 20 MB.'
  if (video) return 'Videos must be under 20 MB.'
  if (doc && !image) return 'Documents must be under 10 MB.'
  return 'Images must be under 1 MB.'
}
