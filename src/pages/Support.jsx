import { useState } from 'react'
import { MessageSquare, HelpCircle, FileCheck, Phone } from 'lucide-react'

const faqs = [
  { q: 'How do I know if my product is genuine?', a: 'Use the verification tool on our website. Enter the security code found on your product packaging to confirm authenticity.' },
  { q: 'What is covered under warranty?', a: 'All TOPBAR devices are covered by a limited warranty against manufacturing defects for a specified period from the date of purchase.' },
  { q: 'How do I clean and maintain my device?', a: 'Regular maintenance includes cleaning the connection points, replacing coils as needed, and keeping the device dry and free of debris.' },
  { q: 'Where can I buy replacement coils?', a: 'Replacement coils are available through our official store, authorized retailers, and selected online marketplaces.' },
]

function Support() {
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    e.target.reset()
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Support</h1>
          <p>Get help with your TOPBAR products. Browse FAQs or contact our support team.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="content-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', marginBottom: '3rem' }}>
            {[
              { icon: HelpCircle, title: 'FAQ', desc: 'Find quick answers to common questions.' },
              { icon: FileCheck, title: 'Warranty', desc: 'Check warranty status and file claims.' },
              { icon: Phone, title: 'Contact Us', desc: 'Reach our support team directly.' },
              { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with a specialist in real time.' },
            ].map((item) => (
              <div key={item.title} className="content-card" style={{ textAlign: 'center' }}>
                <item.icon size={28} style={{ color: 'var(--accent)', marginBottom: '0.75rem' }} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            <div>
              <h2 style={{ marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="content-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <h3 style={{ fontSize: '0.92rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {faq.q}
                      <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0 }}>
                        {openFaq === i ? '−' : '+'}
                      </span>
                    </h3>
                    {openFaq === i && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ marginBottom: '1.25rem' }}>Contact Support</h2>
              {submitted ? (
                <div className="content-card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>Ticket Submitted!</p>
                  <p style={{ fontSize: '0.85rem' }}>We'll get back to you within 24-48 hours.</p>
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
                  <div className="form-field">
                    <label>Product</label>
                    <select>
                      <option>Aegis Legend 5</option>
                      <option>Force</option>
                      <option>Wenax Q2</option>
                      <option>Aegis Hero 5</option>
                      <option>Z Nano 3 Tank</option>
                      <option>Kloud</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Message</label>
                    <textarea rows="5" placeholder="Describe your issue..." required />
                  </div>
                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Support
