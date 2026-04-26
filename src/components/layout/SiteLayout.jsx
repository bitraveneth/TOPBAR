import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AgeGateModal from '../common/AgeGateModal'
import BackToTop from '../common/BackToTop'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
  )
}

function SiteLayout() {
  const [isAccepted, setIsAccepted] = useState(
    () => sessionStorage.getItem('ageAccepted') === 'yes'
  )

  const onAccept = () => {
    sessionStorage.setItem('ageAccepted', 'yes')
    setIsAccepted(true)
  }

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <BackToTop />
      {!isAccepted && <AgeGateModal onAccept={onAccept} />}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default SiteLayout
