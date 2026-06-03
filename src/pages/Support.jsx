/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useMemo, useState } from 'react'
import { Bookmark, ClipboardList, ShieldCheck, Mail, HelpCircle, Search, X } from 'lucide-react'

const supportTopics = [
  {
    id: 'warranty',
    icon: Bookmark,
    title: 'Warranty Claim',
    heading: 'Warranty Claim Support',
    description:
      'Submit product warranty requests with purchase details, serial information, and issue summary.',
    details: [
      'Required: product model, purchase date, country/region',
      'Recommended: package code and product photos',
      'Response target: within 24-48 business hours',
    ],
  },
  {
    id: 'wholesale',
    icon: ClipboardList,
    title: 'Wholesale Request',
    heading: 'Wholesale & Distributor Requests',
    description:
      'Contact TOPBAR for business cooperation, retail supply, and regional distribution opportunities.',
    details: [
      'Share company name and business type',
      'Provide target market and monthly demand',
      'Our business team will follow up with pricing and terms',
    ],
  },
  {
    id: 'counterfeit',
    icon: ShieldCheck,
    title: 'Report Counterfeit',
    heading: 'Counterfeit Product Report',
    description:
      'Help us protect customers by reporting suspected fake products or unauthorized sellers.',
    details: [
      'Attach store/platform information and location',
      'Upload product images and packaging code if possible',
      'Our compliance team investigates each report',
    ],
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact Us',
    heading: 'Contact TOPBAR Support',
    description:
      'For order, product, or usage issues, contact our global support team directly.',
    details: [
      'Email: support@topbarofficial.com',
      'Service hours: Mon-Fri, 09:00-18:00 (UTC+8)',
      'Support language: English',
    ],
  },
  {
    id: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    heading: 'Frequently Asked Questions',
    description:
      'Browse common questions about wholesale, ingredients, shipping, safety, and product usage.',
    details: [
      'Tap any question below to view the answer',
      'Answers cover wholesale, shipping, safety, and usage',
      'Contact us if you need more help',
    ],
  },
]

const faqs = [
  {
    q: 'What is your wholesale pricing?',
    a: 'We offer competitive wholesale prices. Once your application is approved, our sales team will share details with you.',
  },
  {
    q: 'Do you offer wholesale discounts, and what are the minimum order requirements?',
    a: 'Wholesale prices vary by location and order size. Complete the wholesale request form, and we will provide full pricing information.',
  },
  {
    q: 'Are there marketing materials or display kits provided?',
    a: 'Marketing materials are distributed through authorised distributors. Retailers should contact their assigned distributor. If they cannot assist, feel free to reach out to us at support@etopbarvape.com, and we will help guide you to the appropriate resources.',
  },
  {
    q: 'What are the shipping timelines and customs support?',
    a: 'Shipping timelines depend on your location and distributor. For international orders, customs clearance is typically handled by the distributor or shipping partner. Most shipments include tracking numbers. For region-specific details, please contact your assigned distributor.',
  },
  {
    q: 'Can vaping cause an allergy?',
    a: 'Our vapes contain Propylene Glycol (PG), Vegetable Glycerin (VG), nicotine, and flavourings. Some people may be sensitive, so please check the packaging for allergen information.',
  },
  {
    q: 'Is vaping harmful to the human body?',
    a: 'Vapes are intended for adult smokers only. They are smoke-free products that vaporise an e-liquid containing nicotine and flavours. Nicotine is addictive and not risk-free, but because e-cigarettes do not burn tobacco, they may be a better choice for adults than continuing to smoke.',
  },
  {
    q: 'How does age verification work?',
    a: 'Topbar does not sell products directly to consumers. Instead, our distributors and retailers handle all sales and are responsible for verifying that customers meet the legal age requirement before purchase. This process may include checking your name, date of birth, and address. Please note that age verification methods may vary depending on your country or region, based on local laws and regulations.',
  },
  {
    q: 'What are the main ingredients of e-liquid?',
    a: 'Our e-liquid is made with Propylene Glycol (PG) and Vegetable Glycerin (VG), both food-grade or pharmaceutical-grade. We also use a mix of natural and artificial flavours, plus nicotine. If you have allergies to fruits, nuts, or gluten, we recommend avoiding vapes, as some flavourings could cause a reaction.',
  },
  {
    q: 'What should I do if the device tastes burnt?',
    a: 'A burnt taste usually means the e-liquid is low or the coil is overheated. Replace the device or the pod if it continues.',
  },
]
const formPresetByTopic = {
  warranty: {
    title: 'Warranty Claim Form',
    issueType: 'Warranty Claim',
    lockIssueType: true,
  },
  wholesale: {
    title: 'Wholesale Request Form',
    issueType: 'Business / Distributor Inquiry',
    lockIssueType: true,
  },
  counterfeit: {
    title: 'Report Counterfeit Form',
    issueType: 'Counterfeit Report',
    lockIssueType: true,
  },
  contact: {
    title: 'Contact Us Form',
    issueType: '',
    lockIssueType: false,
  },
  faq: {
    title: 'FAQ Contact Form',
    issueType: 'General FAQ Inquiry',
    lockIssueType: true,
  },
}

function Support() {
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
  const [activeTopic, setActiveTopic] = useState(supportTopics[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [heroResult, setHeroResult] = useState(null)
  const [heroNoResult, setHeroNoResult] = useState(false)
  const formPreset = formPresetByTopic[activeTopic] || formPresetByTopic.contact

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
  }, [normalizedSubmittedQuery])
  const liveSuggestions = useMemo(() => {
    if (!normalizedLiveQuery) return []
    return faqs
      .filter((faq) => faq.q.toLowerCase().includes(normalizedLiveQuery))
      .slice(0, 6)
  }, [normalizedLiveQuery])

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
          <p className="page-hero__eyebrow">Help Center</p>
          <h1>Hello, How can we help you?</h1>
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
          <p className="support-page-hero__helper">Or choose a category to quickly find the help you need</p>
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
                <topic.icon size={42} className="support-topic-tile__icon" />
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
            <p>Email <strong>support@topbarofficial.com</strong> and include your product model, issue type, and country/region.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Support
