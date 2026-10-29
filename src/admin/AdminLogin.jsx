/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storeUser } from './adminSession'
import './admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState(() => localStorage.getItem('topbar-admin-username') || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => localStorage.getItem('topbar-admin-remember') !== '0')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    let timedOut = false
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, 12000)
    fetch('/api/admin/session', { credentials: 'include', signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        if (data.authenticated && data.user) {
          storeUser(data.user)
          navigate('/admin/codes', { replace: true })
        }
      })
      .catch((err) => {
        if (!active || err.name === 'AbortError') {
          if (active && timedOut) setError('The admin service did not respond. Refresh and try again.')
          return
        }
        setError('The admin service is not running.')
      })
    return () => {
      active = false
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [navigate])

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 12000)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Sign-in failed.')
      if (!data.user) throw new Error('Sign-in did not start a session. Refresh and try again.')
      storeUser(data.user)
      if (remember) {
        localStorage.setItem('topbar-admin-username', username.trim())
        localStorage.setItem('topbar-admin-remember', '1')
      } else {
        localStorage.removeItem('topbar-admin-username')
        localStorage.setItem('topbar-admin-remember', '0')
      }
      navigate('/admin/codes', { replace: true })
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Sign-in is taking too long. Refresh and try again.' : err.message)
    } finally {
      window.clearTimeout(timer)
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
