/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'
import SectionTitle from './SectionTitle'

function CategoryGrid({ categories }) {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow="Collections" title="Shop by Category" />
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.link} className="category-card">
              <img className="category-card__bg" src={cat.image} alt={cat.name} loading="lazy" />
              <div className="category-card__label">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
