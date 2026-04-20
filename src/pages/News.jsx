const posts = [
  {
    title: 'GEEK-Like Design Language 2026',
    date: 'Apr 2026',
    category: 'Design',
    excerpt: 'Exploring the evolution of our product design philosophy and what it means for the next generation of devices.',
  },
  {
    title: 'New Pod Platform Launch Event',
    date: 'Mar 2026',
    category: 'Events',
    excerpt: 'Join us for the global unveiling of our latest pod platform featuring breakthrough coil technology.',
  },
  {
    title: 'Community Showcase Highlights',
    date: 'Feb 2026',
    category: 'Community',
    excerpt: 'The best builds, setups, and stories from our community members around the world.',
  },
  {
    title: '10th Anniversary Celebration',
    date: 'Jan 2026',
    category: 'Milestone',
    excerpt: 'A decade of innovation, quality, and community. Look back at our journey and what lies ahead.',
  },
  {
    title: 'Sustainability Report 2025',
    date: 'Dec 2025',
    category: 'Sustainability',
    excerpt: 'Our annual sustainability report detailing environmental initiatives, recycling programs, and future commitments.',
  },
  {
    title: 'AS Chip 4.0 Deep Dive',
    date: 'Nov 2025',
    category: 'Technology',
    excerpt: 'Technical breakdown of our latest chipset platform and the engineering decisions behind it.',
  },
]

function News() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>News & Events</h1>
          <p>Stay updated with the latest product launches, events, and industry insights.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="content-grid">
            {posts.map((post) => (
              <article key={post.title} className="content-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span className="pill" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>{post.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
                <h3>{post.title}</h3>
                <p style={{ marginTop: '0.5rem' }}>{post.excerpt}</p>
                <a href="#" style={{ display: 'inline-block', marginTop: '0.75rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Read More →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default News
