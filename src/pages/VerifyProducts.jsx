/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShieldCheck, ScanSearch, PackageCheck } from 'lucide-react'
import { verifyProduct } from '../lib/verifyProduct'
import { formatWhen } from '../lib/verifyFormat'

function VerifyProducts() {
  const [params] = useSearchParams()
  const initial = (params.get('t') || params.get('code') || '').trim()
  const [code, setCode] = useState(initial)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(Boolean(initial))

  useEffect(() => {
    if (!initial) return undefined
    let cancelled = false
    verifyProduct(initial)
      .then((data) => { if (!cancelled) setResult(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [initial])

  async function handleSubmit(event) {
    event.preventDefault()
    const next = code.trim()
    if (!next) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      setResult(await verifyProduct(next))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const outcome = error
    ? { result: 'not_authentic', title: 'Verification unavailable', message: error }
    : result

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">Product Protection</p>
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
                desc: 'Scratch the panel on your TOPBAR pack, or scan the verify link.',
              },
              {
                icon: ShieldCheck,
                title: 'Enter For Check',
                desc: 'Type the last part of the code, or paste the full verify link.',
              },
              {
                icon: PackageCheck,
                title: 'Confirm Authenticity',
                desc: 'A genuine code shows when it was first checked, and how many times since.',
              },
            ].map((item) => (
              <div key={item.title} className="content-card" style={{ textAlign: 'center' }}>
                <item.icon size={28} style={{ color: 'var(--accent)', marginBottom: '0.75rem' }} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="verify-grid">
            <div className="content-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
              <h2 style={{ marginBottom: '0.75rem' }}>Verify Your Code</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Enter the scratch code from your TOPBAR pack. Scanning the pack opens this page and checks the code for you.
              </p>

              <form className="support-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="security-code">Security Code</label>
                  <input
                    id="security-code"
                    type="text"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="ATBRGB7P or paste the verify link"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Checking…' : 'Verify Product'}
                </button>
              </form>

              {outcome && (
                <div className={`verify-result verify-result--${outcome.result}`} role="status" aria-live="polite">
                  <h3>{outcome.title}</h3>
                  <p>{outcome.message}</p>
                  {outcome.verificationCount ? (
                    <p className="verify-result__count">
                      Checked {outcome.verificationCount} {outcome.verificationCount === 1 ? 'time' : 'times'}
                    </p>
                  ) : null}
                  {outcome.firstVerifiedAt ? (
                    <p className="verify-result__meta">First verified {formatWhen(outcome.firstVerifiedAt)}</p>
                  ) : null}
                  {outcome.checkedCode ? (
                    <p className="verify-result__meta">Code {outcome.checkedCode}</p>
                  ) : null}
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
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>A repeat check is a warning</h3>
                  <p>Each genuine code is counted. If the count is already high and you just bought it, contact support before use.</p>
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
