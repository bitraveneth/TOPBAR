/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState(() => localStorage.getItem('topbar-admin-username') || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => localStorage.getItem('topbar-admin-remember') !== '0')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data.authenticated) navigate('/admin/codes', { replace: true })
      })
      .catch(() => {
        if (!cancelled) setError('The verification API is not running.')
      })
    return () => { cancelled = true }
  }, [navigate])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Sign-in failed.')
      if (remember) {
        localStorage.setItem('topbar-admin-username', username.trim())
        localStorage.setItem('topbar-admin-remember', '1')
      } else {
        localStorage.removeItem('topbar-admin-username')
        localStorage.setItem('topbar-admin-remember', '0')
      }
      navigate('/admin/codes', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__panel" onSubmit={submit}>
        <img className="admin-logo" src="/images/topbar-logo.png" alt="TOPBAR" />
        <h1>Sign in</h1>
        <p>Enter your username and password.</p>
        <label className="admin-field">
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <label className="admin-remember">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span>Remember me on this browser</span>
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button type="submit" className="admin-btn" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
