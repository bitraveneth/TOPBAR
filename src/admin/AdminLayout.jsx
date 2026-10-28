/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import './admin.css'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [session, setSession] = useState('loading')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setSession(data.authenticated ? 'in' : 'out')
      })
      .catch(() => {
        if (!cancelled) setSession('down')
      })
    return () => { cancelled = true }
  }, [])

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    navigate('/admin/login', { replace: true })
  }

  if (session === 'loading') return <div className="admin-shell admin-shell--center">Checking session…</div>
  if (session === 'down') {
    return (
      <div className="admin-shell admin-shell--center">
        <p>The verification API is not running. Start it with npm run dev:all.</p>
      </div>
    )
  }
  if (session === 'out') return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div>
          <p className="admin-brand">TOPBAR</p>
          <p className="admin-brand__sub">Verification</p>
          <nav className="admin-nav">
            <NavLink to="/admin/codes" end>Codes</NavLink>
            <NavLink to="/admin/codes/import">Import</NavLink>
            <NavLink to="/admin/activity">Activity</NavLink>
          </nav>
        </div>
        <div className="admin-side__foot">
          <a href="/verify-products" target="_blank" rel="noreferrer">Public check</a>
          <button type="button" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
