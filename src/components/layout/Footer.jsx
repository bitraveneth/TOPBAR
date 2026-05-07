/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'
import { useCms } from '../../contexts/CmsContext'

function Footer() {
  const { merged } = useCms()
  const footer = merged.footer || {}
  const columns = footer.columns || []
  const legalLinks = footer.legalLinks || []

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {columns.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              {(col.links || []).map((link) => (
                <Link key={`${col.title}-${link.label}`} to={link.path}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>{footer.copyright ?? '© 2026 TOPBAR. All Rights Reserved.'}</span>
          <div className="footer-legal">
            {legalLinks.map((link) => (
              <Link key={link.label} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-giant">
        <span className="footer-giant__text">{footer.giantWordmark ?? 'TOP BAR'}</span>
      </div>
    </footer>
  )
}

export default Footer
