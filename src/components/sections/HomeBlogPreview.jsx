import { useCms } from '../../contexts/CmsContext'

function HomeBlogPreview() {
  const { merged } = useCms()
  const blog = merged.home?.blogPreview || {}
  const featuredPost = blog.featuredPost
  const sidePosts = blog.sidePosts || []
  const sectionTitle = blog.sectionTitle || 'NEWS & EVENTS'

  if (!featuredPost) return null

  return (
    <section className="home-blog-section section">
      <div className="container">
        <div className="section-header home-blog-section__header">
          <h1 className="section-hero-title best-flavors-title home-blog-title">{sectionTitle}</h1>
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
