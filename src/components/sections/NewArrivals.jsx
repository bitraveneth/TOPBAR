import { Link } from 'react-router-dom'

function NewArrivals({ items }) {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-hero-title">New Arrival</h1>
        <div className="featured-grid">
          {items.map((item) => (
            <Link key={item.title} to={item.link} className="featured-card">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="featured-card__content">
                <span className="featured-card__tag">{item.tag}</span>
                <h3 className="featured-card__title">{item.title}</h3>
                <p className="featured-card__subtitle">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewArrivals
