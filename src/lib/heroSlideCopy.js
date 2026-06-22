/**
 * Hero slide copy — desktop vs mobile (shorter titles/subtitles on small screens).
 */
export function getHeroSlideCopy(slide, isMobile) {
  if (!slide) {
    return { tag: '', title: '', subtitle: '', cta: '' }
  }

  const mobile = slide.mobile
  if (isMobile && mobile) {
    return {
      tag: mobile.tag ?? slide.tag ?? '',
      title: mobile.title ?? slide.title ?? '',
      subtitle: mobile.subtitle ?? slide.subtitle ?? '',
      cta: mobile.cta ?? slide.cta ?? '',
    }
  }

  return {
    tag: slide.tag ?? '',
    title: slide.title ?? '',
    subtitle: slide.subtitle ?? '',
    cta: slide.cta ?? '',
  }
}
