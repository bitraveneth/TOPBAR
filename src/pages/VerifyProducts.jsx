import { useState } from 'react'
import { ShieldCheck, ScanSearch, PackageCheck } from 'lucide-react'

function VerifyProducts() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    const normalized = code.trim().replace(/\s+/g, '')
    if (normalized.length < 8) {
      setResult({
        type: 'error',
        title: 'Invalid code format',
        message: 'Please enter the full security code from your TOPBAR package.',
      })
      return
    }

    setResult({
      type: 'success',
      title: 'Product code accepted',
      message: 'Your verification request has been submitted. Please compare the code and package details with your purchased product.',
    })
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Verify Products</h1>
          <p>Check your TOPBAR product security code to confirm authenticity.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="content-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '3rem' }}>
            {[
              {
                icon: ScanSearch,
                title: 'Find The Code',
                desc: 'Locate the security or scratch code on your TOPBAR product packaging.',
              },
              {
                icon: ShieldCheck,
                title: 'Enter For Check',
                desc: 'Input the full code below exactly as it appears on the pack.',
              },
              {
                icon: PackageCheck,
                title: 'Confirm Authenticity',
                desc: 'Review the response and product details before use.',
              },
            ].map((item) => (
              <div key={item.title} className="content-card" style={{ textAlign: 'center' }}>
                <item.icon size={28} style={{ color: 'var(--accent)', marginBottom: '0.75rem' }} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)', gap: '2rem', alignItems: 'start' }}>
            <div className="content-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <h2 style={{ marginBottom: '0.75rem' }}>Verify Your Code</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Enter the code from your TOPBAR packaging. This demo page is ready for your real verification workflow later.
              </p>

              <form className="support-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Security Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter product code"
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  Verify Product
                </button>
              </form>

              {result && (
                <div
                  className="content-card"
                  style={{
                    marginTop: '1rem',
                    borderColor: result.type === 'success' ? 'rgba(122, 255, 101, 0.28)' : 'rgba(255, 112, 112, 0.28)',
                    background: result.type === 'success'
                      ? 'linear-gradient(160deg, rgba(122, 255, 101, 0.08), rgba(255,255,255,0.02))'
                      : 'linear-gradient(160deg, rgba(255, 112, 112, 0.08), rgba(255,255,255,0.02))',
                  }}
                >
                  <h3 style={{ marginBottom: '0.35rem' }}>{result.title}</h3>
                  <p>{result.message}</p>
                </div>
              )}
            </div>

            <div className="content-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <h2 style={{ marginBottom: '0.75rem' }}>Verification Tips</h2>
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Use the original pack</h3>
                  <p>Always verify from the printed package code, not from screenshots or edited images.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Check label details</h3>
                  <p>Match the product name, flavor, and puff series with the packaging you purchased.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Need help?</h3>
                  <p>If the code looks damaged or unreadable, contact the TOPBAR support team before using the product.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default VerifyProducts
