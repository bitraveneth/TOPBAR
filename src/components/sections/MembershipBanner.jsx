import { Link } from 'react-router-dom'
import { Award } from 'lucide-react'

function MembershipBanner() {
  return (
    <section className="section">
      <div className="container">
        <div className="membership-banner">
          <Award size={36} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
          <h3>G-Points Rewards Membership</h3>
          <p>
            Join our membership program to earn points, unlock exclusive offers,
            and get early access to new product launches.
          </p>
          <Link to="/about" className="btn-outline">Learn More</Link>
        </div>
      </div>
    </section>
  )
}

export default MembershipBanner
