/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Link } from 'react-router-dom'
import { cardImageProps } from '../../lib/responsiveImage'

function BestSellingFlavors({ groups = [] }) {
  if (!groups.length) return null
  const shortFlavorName = (name) => {
    const map = {
      'Strawberry Mint Lemonade': 'Strawberry Mint',
      'Blue Raspberry Lemonade': 'Blue Raspberry',
      'White Peach Raspberry': 'White Peach',
      'Cherry Peach Lemon': 'Cherry Peach',
      'Kiwi Passion Guava': 'Kiwi Guava',
      'Pomegranate Berry': 'Pomegranate',
      'Watermelon Ice': 'Watermelon',
      'Pineapple Ice': 'Pineapple',
      'Strawberry Ice': 'Strawberry',
    }
    return map[name] || name
  }

  return (
    <section className="section best-flavors-section">
      <div className="container">
        <h2 className="section-hero-title best-flavors-title">Best Selling Flavors</h2>
        {groups.map((group) => (
          <div key={group.title} className="best-flavors-group">
            <div className="best-flavors-grid">
              {group.flavors.map((flavor) => {
                const flavorImage = cardImageProps(flavor.image)
                return (
                <Link
                  key={`${group.title}-${flavor.name}-${flavor._slot ?? flavor.slug ?? ''}`}
                  to={`/products/${flavor.slug || group.slug}`}
                  className="best-flavor-card"
                >
                  <img
                    src={flavorImage.src || flavor.image}
                    srcSet={flavorImage.srcSet}
                    sizes={flavorImage.sizes}
                    alt={flavor.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="best-flavor-card__label">
                    <span style={{ '--flavor-color': flavor.hex }} />
                    <h3>{shortFlavorName(flavor.name)}</h3>
                    <small>{flavor.productTitle || group.title}</small>
                  </div>
                </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BestSellingFlavors
