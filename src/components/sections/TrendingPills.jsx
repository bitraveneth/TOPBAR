/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import SectionTitle from './SectionTitle'

function TrendingPills({ items }) {
  return (
    <section className="section--sm">
      <div className="container">
        <SectionTitle eyebrow="New Trending" title="What's Hot Right Now" />
        <div className="trending-row">
          {items.map((item) => (
            <Link key={item.label} to={item.link} className="pill">
              <TrendingUp size={14} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrendingPills
