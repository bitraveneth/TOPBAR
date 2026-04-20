import { useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              <img src="/images/topbar-logo.svg" alt="TOPBAR" className="footer-brand-logo" />
            </div>
            <p className="footer-brand-text">
              Premium vaping experience — crafted for those who demand excellence.
            </p>
          </div>

          <div className="footer-col">
            <h4>Products</h4>
            <Link to="/products?cat=Pod">Pod</Link>
            <Link to="/products?cat=Pod+Mod">Pod Mod</Link>
            <Link to="/products?cat=Box+Mod">Box Mod</Link>
            <Link to="/products?cat=Tank">Tank</Link>
          </div>

          <div className="footer-col">
            <h4>About Us</h4>
            <Link to="/about">Our Brand</Link>
            <Link to="/news">News & Events</Link>
            <Link to="/news">Blog</Link>
            <Link to="/about">Join Us</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/support">FAQ</Link>
            <Link to="/support">Warranty</Link>
            <Link to="/support">Contact Us</Link>
            <Link to="/downloads">Downloads</Link>
            <Link to="/compliance">Verify</Link>
          </div>

          <div className="footer-col">
            <h4>Subscribe</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Keep up with TOPBAR! Subscribe for updates and exclusive offers.
            </p>
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">{subscribed ? '✓' : 'Submit'}</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TOPBAR. All Rights Reserved.</span>
          <div className="footer-legal">
            <Link to="/compliance">Privacy Policy</Link>
            <Link to="/compliance">Terms of Use</Link>
            <Link to="/compliance">Cookie Policy</Link>
          </div>
        </div>
      </div>

      <div className="footer-giant">
        <span className="footer-giant__text">TOP BAR</span>
      </div>
    </footer>
  )
}

export default Footer
