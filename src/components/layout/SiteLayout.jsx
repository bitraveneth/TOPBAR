/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CmsProvider } from '../../contexts/CmsContext'
import Header from './Header'
import Footer from './Footer'
import BackToTop from '../common/BackToTop'
import FloatingCommunityBadge from '../common/FloatingCommunityBadge'
import AgeGateModal from '../common/AgeGateModal'

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
  return (
    <CmsProvider>
      <AgeGateModal />
      <ScrollToTop />
      <ScrollProgress />
      <BackToTop />
      <FloatingCommunityBadge />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </CmsProvider>
  )
}

export default SiteLayout
