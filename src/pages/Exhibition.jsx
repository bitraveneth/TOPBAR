/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useCms } from '../contexts/useCms'

function Exhibition() {
  const { merged } = useCms()
  const page = merged.exhibition || {}
  const exhibitions = page.events || []
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredExhibitions = normalizedQuery
    ? exhibitions.filter((item) =>
        `${item.name} ${item.date} ${item.place} ${item.booth}`.toLowerCase().includes(normalizedQuery)
      )
    : exhibitions
  const years = [...new Set(filteredExhibitions.map((item) => item.year))].sort((a, b) => b - a)

  return (
    <>
      <div className="page-hero support-page-hero exhibition-page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">{page.eyebrow || 'Global Showcase'}</p>
          <h1>{page.title || 'Exhibitions & Global Events'}</h1>
          <form className="support-page-hero__search" onSubmit={(e) => e.preventDefault()}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search exhibitions, cities, or dates..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search exhibitions"
            />
            <button type="submit">Search</button>
          </form>
          <p className="support-page-hero__helper">{page.helper}</p>
        </div>
      </div>

      <section className="section exhibition-page">
        <div className="container">
          {normalizedQuery && filteredExhibitions.length === 0 && (
            <div className="notice">
              <h3>No events found</h3>
              <p>Try another keyword, city, booth, or date.</p>
            </div>
          )}
          {years.map((year) => {
            const items = filteredExhibitions.filter((item) => item.year === year)
            return (
              <div key={year} className="exhibition-year-block">
                <h2 className="exhibition-year-title">{year}</h2>
                <div className="exhibition-grid">
                  {items.map((event) => (
                    <article key={event.id || `${event.name}-${event.date}`} className="exhibition-card">
                      <div className="exhibition-card__media">
                        <img src={event.image} alt={event.name} loading="lazy" decoding="async" />
                      </div>
                      <h3>{event.name}</h3>
                      <p><strong>Date:</strong> {event.date}</p>
                      <p><strong>Place:</strong> {event.place}</p>
                      <p><strong>Booth:</strong> {event.booth}</p>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Exhibition

