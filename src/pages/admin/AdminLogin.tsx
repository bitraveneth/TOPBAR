import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import { isStaffRole } from '../../lib/adminRoles'
import '../../styles/admin-tailwind.css'
import '../../styles/admin.css'

export default function AdminLogin() {
  const location = useLocation()
  const misconfigured = location.state?.misconfigured
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    let cancelled = false
    ;(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user || cancelled) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()
      if (!cancelled && isStaffRole(profile?.role)) setRedirect(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (redirect) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }
    setLoading(true)
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signErr) {
      setError(signErr.message)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('Could not load user.')
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (!isStaffRole(profile?.role)) {
      await supabase.auth.signOut()
      setError('This account does not have admin access.')
      return
    }
    setRedirect(true)
  }

  return (
    <div className="admin-root admin-login">
      <div className="admin-login__card">
        <h1>Admin</h1>
        <p>Sign in with an account that has admin access.</p>
        {misconfigured && (
          <p className="admin-msg admin-msg--err" role="alert">
            Missing Supabase env vars. Copy .env.example to .env and add your project keys.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-login__field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? (
            <p className="admin-msg admin-msg--err" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="admin-btn admin-login__btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
