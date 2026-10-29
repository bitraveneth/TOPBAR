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
import { verifyCopy } from '../lib/verifyMessages'

function ResultGlyph({ result }) {
  const errorResult = result === 'not_authentic' || result === 'over_verified'
  const Icon = result === 'genuine' ? ShieldCheck : errorResult ? ShieldX : ShieldAlert
  return <Icon size={28} />
}

function shownOutcome(outcome) {
  if (!outcome) return null
  const copy = verifyCopy({
    result: outcome.result,
    code: outcome.checkedCode,
    count: outcome.verificationCount,
    firstVerifiedAt: outcome.firstVerifiedAt ? formatWhen(outcome.firstVerifiedAt) : '',
  })
  return copy ? { ...outcome, title: copy.title, message: copy.message } : outcome
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
    : shownOutcome(result)
  const steps = [
    {
      icon: ScanSearch,
      title: 'Find The Code',
      desc: 'Find the long security number printed on your TOPBAR pack.',
    },
    {
      icon: ShieldCheck,
      title: 'Enter For Check',
      desc: 'Type the full number below. You do not need a link.',
    },
    {
      icon: PackageCheck,
      title: 'Confirm Authenticity',
      desc: 'Review the response and product details before use.',
    },
  ]
  return (
    <>
      <div className="page-hero verify-hero">
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
                  <item.icon size={30} />
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
              <div className="verify-panel__head">
                <span className="verify-panel__badge" aria-hidden="true"><ShieldCheck size={28} /></span>
                <p className="verify-panel__kicker">Security check</p>
                <h2 className="verify-panel__title">Verify Your Code</h2>
              </div>
              <p className="verify-panel__lead">
                Type the security code from your TOPBAR pack. It is the long number on the label.
              </p>

              <form className="support-form verify-panel__form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="security-code">Security Code</label>
                  <input
                    id="security-code"
                    type="text"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="2860994911575137"
                    inputMode="numeric"
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
                </div>
              )}
            </div>

            <aside className="verify-tips">
              <p className="verify-tips__kicker">Before you check</p>
              <h2>Verification Tips</h2>
              <ol className="verify-tips__list">
                {[
                  ['Use the original pack', 'Always verify from the printed package code, not from screenshots or edited images.'],
                  ['Check label details', 'Match the product name, flavor, and puff series with the packaging you purchased.'],
                  ['Use this page', 'Enter the code on the official TOPBAR verify page, not a link someone sent you.'],
                  ['Read the result', 'A first check confirms the pack. If it was already verified, contact your retailer before use.'],
                  ['Need help?', 'If the code looks damaged or unreadable, contact the TOPBAR support team before using the product.'],
                ].map(([title, text], index) => (
                  <li key={title} className="verify-tip">
                    <span className="verify-tip__mark" aria-hidden="true">{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default VerifyProducts
