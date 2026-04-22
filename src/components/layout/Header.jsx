import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown, ShoppingBag } from 'lucide-react'
import navigation from '../../data/navigation.json'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMega, setActiveMega] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const openMega = (label) => {
    clearTimeout(timeoutRef.current)
    setActiveMega(label)
  }

  const closeMega = () => {
    timeoutRef.current = setTimeout(() => setActiveMega(null), 150)
  }

  return (
    <>
      <div className="warning-bar">
        <strong>WARNING:</strong> This product contains nicotine. Nicotine is an addictive chemical.
      </div>
      <header className="site-header" style={scrolled ? { borderBottomColor: 'rgba(255,255,255,0.06)' } : undefined}>
        <div className="header-inner container">
          <Link to="/" className="brand">
            <img src="/images/topbar-logo.svg" alt="TOPBAR" className="brand-logo" />
          </Link>

          <nav className={`main-nav${mobileOpen ? ' open' : ''}`}>
            {navigation.primaryNav.map((item) => (
              <div
                key={item.label}
                className="nav-item"
                onMouseEnter={() => item.children && openMega(item.label)}
                onMouseLeave={() => item.children && closeMega()}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={() => { setMobileOpen(false); setActiveMega(null) }}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </NavLink>

                {item.children && activeMega === item.label && (
                  <div className="mega-menu" style={{ gridTemplateColumns: `repeat(${Math.min(item.children.length, 3)}, 1fr)` }}>
                    {item.children.map((section) => (
                      <div key={section.title}>
                        <h4>{section.title}</h4>
                        <ul>
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <NavLink to={link.path} onClick={() => { setMobileOpen(false); setActiveMega(null) }}>
                                {link.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/products" className="btn-store">
              <ShoppingBag size={14} />
              Store
            </Link>
            <button
              className="menu-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
