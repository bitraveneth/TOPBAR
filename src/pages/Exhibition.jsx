/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

const exhibitions = [
  { name: 'ShishaMesse Frankfurt', date: 'May 08 - May 10, 2026', place: 'Frankfurt, Germany', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-01.jpg' },
  { name: 'The Vaper Expo UK', date: 'May 08 - May 10, 2026', place: 'Birmingham, United Kingdom', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-02.jpg' },
  { name: 'National Convenience Show', date: 'April 13 - April 15, 2026', place: 'Birmingham, United Kingdom', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-03.jpg' },
  { name: 'EVO NXT Prague', date: 'April 17 - April 18, 2026', place: 'Prague, Czech Republic', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-04.jpg' },
  { name: 'VAPEXPO PARIS', date: 'March 22 - March 23, 2026', place: 'Paris, France (Expo Porte de Versailles - Pavillon 6)', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-05.jpg' },
  { name: 'THE UK FOOD & DRINK SHOWS', date: 'April 13 - April 15, 2026', place: 'Birmingham, United Kingdom (NEC)', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-06.jpg' },
  { name: 'TABACCO PLUS EXPO (TPE)', date: 'March 31 - April 02, 2026', place: 'Las Vegas, United States', booth: 'GB 54', year: 2026, image: '/assets/images/exhibition/exhibition-07.jpg' },
  { name: 'T2000 In Tour', date: 'March 21 - March 22, 2026', place: 'Catania, Italy', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-08.jpg' },
  { name: 'CHAMPS TRADE SHOW', date: 'February 2026', place: 'To Be Determined', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-09.jpg' },
  { name: 'WT Middle East', date: 'November 10 - November 11, 2025', place: 'Dubai, UAE', booth: 'HC 27', year: 2025, image: '/assets/images/exhibition/exhibition-10.jpg' },
  { name: 'T2000 In Tour', date: 'October 04 - October 05, 2025', place: 'Carrara', booth: 'GB40', year: 2025, image: '/assets/images/exhibition/exhibition-11.jpg' },
  { name: 'VAPER EXPO UK', date: 'October 2025', place: 'Birmingham, United Kingdom', booth: 'GB 72', year: 2025, image: '/assets/images/exhibition/exhibition-12.jpg' },
  { name: 'VAPEXPRO', date: 'September 27 - September 28, 2025', place: 'EXPO XXI Exhibition Center, Warsaw', booth: 'A3', year: 2025, image: '/assets/images/exhibition/exhibition-01.jpg' },
  { name: 'INTERTABAC', date: 'September 2025', place: 'Dortmund, Germany', booth: 'GB 80', year: 2025, image: '/assets/images/exhibition/exhibition-02.jpg' },
  { name: 'VAPE CLUB SHOW', date: 'August 30 - August 31, 2025', place: 'Moscow, Crocus Expo', booth: '505', year: 2025, image: '/assets/images/exhibition/exhibition-03.jpg' },
  { name: 'WORLD VAPE SHOW', date: 'June 18 - June 20, 2025', place: 'Dubai, United Arab Emirates', booth: '2155', year: 2025, image: '/assets/images/exhibition/exhibition-04.jpg' },
  { name: 'VAPEXPO SPAIN', date: 'May 31 - June 01, 2025', place: 'Madrid, Spain', booth: 'B11', year: 2025, image: '/assets/images/exhibition/exhibition-05.jpg' },
  { name: 'VAPER EXPO UK', date: 'May 09 - May 11, 2025', place: 'NEC Birmingham, UK', booth: 'B110', year: 2025, image: '/assets/images/exhibition/exhibition-06.jpg' },
  { name: 'SHISHAMESSE', date: 'April 25 - April 27, 2025', place: 'Messe Frankfurt, Germany', booth: '6D + 5E', year: 2025, image: '/assets/images/exhibition/exhibition-07.jpg' },
  { name: 'VAPEXPO', date: 'March 23 - March 24, 2025', place: 'Centre de Congres Lyon, France', booth: '100', year: 2025, image: '/assets/images/exhibition/exhibition-08.jpg' },
]

function Exhibition() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredExhibitions = useMemo(
    () =>
      normalizedQuery
        ? exhibitions.filter((item) =>
            `${item.name} ${item.date} ${item.place} ${item.booth}`.toLowerCase().includes(normalizedQuery)
          )
        : exhibitions,
    [normalizedQuery],
  )
  const years = [...new Set(filteredExhibitions.map((item) => item.year))].sort((a, b) => b - a)

  return (
    <>
      <div className="page-hero support-page-hero exhibition-page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">Global Showcase</p>
          <h1>Exhibitions & Global Events</h1>
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
          <p className="support-page-hero__helper">Explore TOPBAR participation in global vape and trade exhibitions.</p>
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
                    <article key={`${event.name}-${event.date}`} className="exhibition-card">
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

