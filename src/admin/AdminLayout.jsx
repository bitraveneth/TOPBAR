/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Activity, Clapperboard, Download, Images, KeyRound, LogOut, ShieldCheck, Store, Ticket, Upload, Users } from 'lucide-react'
import { AdminSessionContext } from './adminSession'
import './admin.css'

const ROLE_LABELS = {
  superadmin: 'Super admin',
  admin: 'Admin',
  staff: 'Staff',
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const [session, setSession] = useState({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return
        setSession(data.authenticated ? { status: 'in', user: data.user } : { status: 'out' })
      })
      .catch(() => {
        if (!cancelled) setSession({ status: 'down' })
      })
    return () => { cancelled = true }
  }, [])

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    navigate('/admin/login', { replace: true })
  }

  if (session.status === 'loading') return <div className="admin-shell admin-shell--center">Checking session…</div>
  if (session.status === 'down') {
    return (
      <div className="admin-shell admin-shell--center">
        <p>The admin API is not running. Start it with npm run dev:all.</p>
      </div>
    )
  }
  if (session.status === 'out') return <Navigate to="/admin/login" replace />

  const { user } = session
  const content = user.permissions.includes('content')
  const users = user.permissions.includes('users')

  return (
    <AdminSessionContext.Provider value={{ user }}>
      <div className="admin-shell">
        <aside className="admin-side">
          <div className="admin-side__scroll">
            <NavLink to="/admin/codes" className="admin-logo-link" end>
              <img src="/images/topbar-logo.png" alt="TOPBAR" />
            </NavLink>
            <nav className="admin-nav">
              <p className="admin-nav__label">Codes</p>
              <NavLink to="/admin/codes" end><KeyRound size={16} /> Codes</NavLink>
              <NavLink to="/admin/codes/import"><Upload size={16} /> Import</NavLink>
              <NavLink to="/admin/activity"><Activity size={16} /> Activity</NavLink>
              {content ? (
                <>
                  <p className="admin-nav__label">Website</p>
                  <NavLink to="/admin/products"><Store size={16} /> Products</NavLink>
                  <NavLink to="/admin/homepage"><Clapperboard size={16} /> Homepage</NavLink>
                  <NavLink to="/admin/exhibition"><Ticket size={16} /> Exhibitions</NavLink>
                  <NavLink to="/admin/downloads"><Download size={16} /> Downloads</NavLink>
                  <NavLink to="/admin/support"><ShieldCheck size={16} /> Support</NavLink>
                  <NavLink to="/admin/media"><Images size={16} /> Media</NavLink>
                </>
              ) : null}
              {users ? (
                <>
                  <p className="admin-nav__label">Account</p>
                  <NavLink to="/admin/users"><Users size={16} /> Users</NavLink>
                </>
              ) : null}
            </nav>
          </div>
          <div className="admin-side__foot">
            <p className="admin-userchip">
              <strong>{user.displayName}</strong>
              <span>{ROLE_LABELS[user.role] || user.role}</span>
            </p>
            <a href="/" target="_blank" rel="noreferrer"><Store size={15} /> View site</a>
            <button type="button" onClick={signOut}><LogOut size={15} /> Sign out</button>
          </div>
        </aside>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </AdminSessionContext.Provider>
  )
}
