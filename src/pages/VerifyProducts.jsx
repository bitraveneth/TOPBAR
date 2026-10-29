/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShieldAlert, ShieldCheck, ShieldX, ScanSearch, PackageCheck } from 'lucide-react'
import { verifyProduct } from '../lib/verifyProduct'
import { formatWhen } from '../lib/verifyFormat'

function ResultGlyph({ result }) {
  const Icon = result === 'genuine' ? ShieldCheck : result === 'not_authentic' ? ShieldX : ShieldAlert
  return <Icon size={22} />
}

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
  const steps = [
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
  ]
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
        <div className="container verify-page">
          <ol className="verify-steps">
            {steps.map((item, index) => (
              <li key={item.title} className="verify-step">
                <span className="verify-step__mark" aria-hidden="true">
                  <item.icon size={22} />
                  <span>{index + 1}</span>
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="verify-grid">
            <div className="content-card verify-panel">
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
                  <div className="verify-result__icon" aria-hidden="true"><ResultGlyph result={outcome.result} /></div>
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

            <div className="content-card verify-tips">
              <h2>Verification Tips</h2>
              <div className="verify-tips__list">
                <div>
                  <h3>Use the original pack</h3>
                  <p>Always verify from the printed package code, not from screenshots or edited images.</p>
                </div>
                <div>
                  <h3>Check label details</h3>
                  <p>Match the product name, flavor, and puff series with the packaging you purchased.</p>
                </div>
                <div>
                  <h3>Need help?</h3>
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
