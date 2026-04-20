function TestimonialMarquee({ testimonials }) {
  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="testimonials">
      <div className="container" style={{ marginBottom: '1.5rem' }}>
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Geek Life</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
          What Our Community Says
        </h2>
      </div>
      <div className="marquee">
        {doubled.map((t, i) => (
          <div key={i} className="testimonial-card">
            <p className="testimonial-card__text">"{t.text}"</p>
            <span className="testimonial-card__author">— {t.author}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialMarquee
