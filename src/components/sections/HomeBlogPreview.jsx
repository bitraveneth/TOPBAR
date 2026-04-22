const featuredPost = {
  title: 'Inside The Flavor Journey',
  category: 'Stories',
  date: 'April 2026',
  excerpt:
    'A closer look at how TOPBAR blends flavor direction, design decisions, and everyday portability into one premium experience.',
  image: '/images/hero/topbar-hero-beach-sunrise.png',
}

const sidePosts = [
  {
    title: '9900 Puffs Highlights',
    category: 'Product',
    date: 'April 2026',
    image: '/images/hero/topbar-hero-collapse.png',
    excerpt:
      'A quick product story focused on performance, smooth draw, and the premium feel behind the 9900 Puffs lineup.',
  },
  {
    title: 'TOPBAR Design Details',
    category: 'Design',
    date: 'March 2026',
    image: '/images/hero/topbar-hero-volcano.png',
    excerpt:
      'From silhouette to finish, this story highlights the visual choices that shape the TOPBAR brand language.',
  },
]

function HomeBlogPreview() {
  return (
    <section className="home-blog-section section">
      <div className="container">
        <div className="section-header home-blog-section__header">
          <h1 className="section-hero-title best-flavors-title home-blog-title">NEWS &amp; EVENTS</h1>
        </div>

        <div className="home-blog-grid">
          <article className="home-blog-card home-blog-card--featured">
            <div className="home-blog-featured__image">
              <img src={featuredPost.image} alt={featuredPost.title} loading="lazy" />
            </div>
            <div className="home-blog-featured__content">
              <div className="home-blog-meta">
                <span className="pill">{featuredPost.category}</span>
                <span className="home-blog-meta__date">{featuredPost.date}</span>
              </div>
              <h3>{featuredPost.title}</h3>
              <p>{featuredPost.excerpt}</p>
              <a href="#" className="home-blog-link home-blog-link--center">Read More</a>
            </div>
          </article>

          {sidePosts.map((post) => (
            <article key={post.title} className="home-blog-card">
              <div className="home-blog-card__image">
                <img src={post.image} alt={post.title} loading="lazy" />
              </div>
              <div className="home-blog-card__content">
                <div className="home-blog-meta">
                  <span className="pill">{post.category}</span>
                  <span className="home-blog-meta__date">{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a href="#" className="home-blog-link home-blog-link--center">Read More</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeBlogPreview
