import { useState } from 'react'
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import { useCms } from '../../contexts/CmsContext'

function NewsletterSignup() {
  const { merged } = useCms()
  const copy = merged.newsletter || {}
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: trimmed.toLowerCase(),
        source: 'website',
      })
      if (error && error.code !== '23505') {
        console.error(error)
      }
    }

    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-card__content">
            <h2 className="newsletter-card__title">{copy.title ?? 'Taste the next drop first.'}</h2>
          </div>
          <form className="subscribe-form newsletter-form" onSubmit={handleSubscribe}>
            <label className="newsletter-field">
              <span>{copy.emailLabel ?? 'Email'}</span>
              <input
                type="email"
                placeholder={copy.placeholder ?? 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button
              type="submit"
              className={subscribed ? 'newsletter-submit--done' : undefined}
              disabled={!email.trim()}
            >
              {subscribed ? (copy.buttonJoined ?? 'Joined') : (copy.buttonJoin ?? 'Join Drop List')}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default NewsletterSignup
