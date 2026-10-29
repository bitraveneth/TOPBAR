/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useMemo, useState } from 'react'
import { Bookmark, ClipboardList, ShieldCheck, Mail, HelpCircle, Search, X } from 'lucide-react'
import { useCms } from '../contexts/useCms'

const TOPIC_ICONS = {
  warranty: Bookmark,
  wholesale: ClipboardList,
  counterfeit: ShieldCheck,
  contact: Mail,
  faq: HelpCircle,
}

const EMPTY_LIST = []

function TopicIcon({ name }) {
  const Icon = TOPIC_ICONS[name] || HelpCircle
  return <Icon size={42} className="support-topic-tile__icon" />
}

function Support() {
  const { merged } = useCms()
  const page = merged.support || {}
  const supportTopics = page.topics ?? EMPTY_LIST
  const faqs = page.faqs ?? EMPTY_LIST
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [activeTopic, setActiveTopic] = useState(supportTopics[0]?.id || 'warranty')
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [heroResult, setHeroResult] = useState(null)
  const [heroNoResult, setHeroNoResult] = useState(false)
  const topic = supportTopics.find((item) => item.id === activeTopic) || supportTopics[0]
  const formPreset = {
    title: topic?.formTitle || topic?.heading || 'Contact Us Form',
    issueType: topic?.issueType || '',
    lockIssueType: topic?.lockIssueType !== false && topic?.id !== 'contact',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    e.target.reset()
  }

  const normalizedSubmittedQuery = submittedQuery.trim().toLowerCase()
  const normalizedLiveQuery = searchQuery.trim().toLowerCase()
  const filteredFaqs = useMemo(() => {
    if (!normalizedSubmittedQuery) return faqs
    return faqs.filter((faq) =>
      `${faq.q} ${faq.a}`.toLowerCase().includes(normalizedSubmittedQuery)
    )
  }, [faqs, normalizedSubmittedQuery])
  const liveSuggestions = useMemo(() => {
    if (!normalizedLiveQuery) return []
    return faqs
      .filter((faq) => faq.q.toLowerCase().includes(normalizedLiveQuery))
      .slice(0, 6)
  }, [faqs, normalizedLiveQuery])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const next = searchQuery.trim()
    if (!next) return
    setSubmittedQuery(next)
    const normalized = next.toLowerCase()
    const firstMatch = faqs.find((faq) => `${faq.q} ${faq.a}`.toLowerCase().includes(normalized))
    setHeroResult(firstMatch || null)
    setHeroNoResult(!firstMatch)
    if (firstMatch) {
      setActiveTopic('faq')
      setOpenFaq(faqs.findIndex((faq) => faq.q === firstMatch.q))
    }
  }

  const handlePickSuggestion = (faqItem) => {
    setSearchQuery(faqItem.q)
    setSubmittedQuery(faqItem.q)
    setHeroResult(faqItem)
    setHeroNoResult(false)
    setActiveTopic('faq')
    setOpenFaq(faqs.findIndex((faq) => faq.q === faqItem.q))
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSubmittedQuery('')
    setOpenFaq(null)
    setHeroResult(null)
    setHeroNoResult(false)
  }

  return (
    <>
      <div className="page-hero support-page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">{page.eyebrow || 'Help Center'}</p>
          <h1>{page.title || 'Hello, How can we help you?'}</h1>
          <form className="support-page-hero__search" onSubmit={handleSearchSubmit}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search support topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search support topics"
            />
            {searchQuery.trim() && (
              <button type="button" className="support-page-hero__clear" onClick={clearSearch} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
            <button type="submit" className="support-page-hero__submit">Search</button>
          </form>
          {liveSuggestions.length > 0 && (
            <div className="support-page-hero__suggestions">
              <p className="support-page-hero__suggestions-label">Suggested questions</p>
              {liveSuggestions.map((faq) => (
                <button
                  key={faq.q}
                  type="button"
                  className="support-page-hero__suggestion"
                  onClick={() => handlePickSuggestion(faq)}
                >
                  {faq.q}
                </button>
              ))}
            </div>
          )}
          {heroResult && (
            <div className="support-page-hero__result content-card">
              <h3>{heroResult.q}</h3>
              <p>{heroResult.a}</p>
              <button type="button" className="btn-primary support-page-hero__result-btn" onClick={() => setActiveTopic('faq')}>
                View in FAQ
              </button>
            </div>
          )}
          {heroNoResult && (
            <div className="support-page-hero__result support-page-hero__result--empty content-card">
              <h3>No exact answer found</h3>
              <p>Try another keyword or open Contact Us for direct help.</p>
              <button type="button" className="btn-primary support-page-hero__result-btn" onClick={() => setActiveTopic('contact')}>
                Contact Us
              </button>
            </div>
          )}
          <p className="support-page-hero__helper">{page.helper}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="support-topic-grid" role="tablist" aria-label="Support categories">
            {supportTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`support-topic-tile${activeTopic === topic.id ? ' is-active' : ''}`}
                onClick={() => setActiveTopic(topic.id)}
                role="tab"
                aria-selected={activeTopic === topic.id}
              >
                <TopicIcon name={topic.icon || topic.id} />
                <span className="support-topic-tile__label">{topic.title}</span>
              </button>
            ))}
          </div>

          {activeTopic === 'faq' ? (
            <div className="support-faq">
              <h2>Frequently Asked Questions</h2>
              <div className="support-faq__list">
                {filteredFaqs.map((faq, i) => (
                  <div
                    key={faq.q}
                    className="content-card support-faq__item"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setOpenFaq(openFaq === i ? null : i)
                      }
                    }}
                  >
                    <h3 className="support-faq__question">
                      {faq.q}
                      <span className="support-faq__toggle">{openFaq === i ? '−' : '+'}</span>
                    </h3>
                    {openFaq === i && <p className="support-faq__answer">{faq.a}</p>}
                  </div>
                ))}
              </div>
              {normalizedSubmittedQuery && filteredFaqs.length === 0 && (
                <div className="content-card support-faq__empty">
                  <p>No FAQ results found for "{submittedQuery}".</p>
                  <button type="button" className="btn-primary" onClick={() => setActiveTopic('contact')}>
                    Contact Us
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="support-contact">
              <h2>{formPreset.title}</h2>
              {topic?.description ? <p>{topic.description}</p> : null}
              {topic?.details?.length ? (
                <ul className="support-topic-points">
                  {topic.details.map((line) => <li key={line}>{line}</li>)}
                </ul>
              ) : null}
              {submitted ? (
                <div className="content-card support-contact__success">
                  <p className="support-contact__success-title">Ticket Submitted</p>
                  <p>Thanks for contacting TOPBAR support. We will reply within 24-48 business hours.</p>
                </div>
              ) : (
                <form className="support-form" onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label>Full Name</label>
                    <input type="text" required />
                  </div>
                  <div className="form-field">
                    <label>Email</label>
                    <input type="email" required />
                  </div>

                  {activeTopic === 'wholesale' && (
                    <div className="form-field">
                      <label>Company Name</label>
                      <input type="text" placeholder="Your company name" required />
                    </div>
                  )}

                  {activeTopic === 'counterfeit' && (
                    <div className="form-field">
                      <label>Suspicious Seller / Store</label>
                      <input type="text" placeholder="Store name, URL, or location" required />
                    </div>
                  )}

                  {formPreset.lockIssueType ? (
                    <div className="form-field">
                      <label>Issue Type</label>
                      <input type="text" value={formPreset.issueType} readOnly />
                    </div>
                  ) : (
                    <div className="form-field">
                      <label>Issue Type</label>
                      <select required defaultValue="">
                        <option value="" disabled>Select an issue</option>
                        <option>Product Verification</option>
                        <option>Warranty Claim</option>
                        <option>Counterfeit Report</option>
                        <option>Device Quality Issue</option>
                        <option>Flavor / Experience Feedback</option>
                        <option>Order / Retail Support</option>
                        <option>Business / Distributor Inquiry</option>
                        <option>General FAQ Inquiry</option>
                      </select>
                    </div>
                  )}

                  <div className="form-field">
                    <label>Product</label>
                    <select required defaultValue="">
                      <option value="" disabled>Select a product</option>
                      <option>TOPBAR 8000 Puffs</option>
                      <option>TOPBAR 40000 Puffs</option>
                      <option>TOPBAR 50000 Puffs</option>
                      <option>TOPBAR 60000 Puffs</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Country / Region</label>
                    <input type="text" placeholder="e.g. USA, UAE, UK" required />
                  </div>
                  <div className="form-field">
                    <label>Purchase Channel</label>
                    <input type="text" placeholder="Store name or platform" />
                  </div>
                  <div className="form-field">
                    <label>Order ID (Optional)</label>
                    <input type="text" placeholder="Order number / receipt reference" />
                  </div>
                  <div className="form-field">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Describe your issue..." required />
                  </div>
                  <button type="submit" className="btn-primary support-form__submit">
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="notice">
            <h3>Need direct assistance?</h3>
            <p>{page.notice || `Email ${page.email || 'support@topbarofficial.com'} and include your product model, issue type, and country/region.`}</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Support
