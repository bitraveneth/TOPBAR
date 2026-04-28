import { NavLink, Outlet } from 'react-router-dom'
import {
  Braces,
  Clock,
  Home,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  Package,
  PanelBottom,
  Users,
} from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const EDITOR_LINKS = [
  { to: '/admin/site', label: 'Site', icon: LayoutTemplate },
  { to: '/admin/navigation', label: 'Navigation', icon: Menu },
  { to: '/admin/home', label: 'Home', icon: Home },
  { to: '/admin/footer', label: 'Footer', icon: PanelBottom },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/media', label: 'Media', icon: Image },
  { to: '/admin/revisions', label: 'Revisions', icon: Clock },
  { to: '/admin/json', label: 'JSON', icon: Braces },
]

export default function AdminLayout() {
  async function handleSignOut() {
    await supabase?.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="admin-root admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">TOPBAR Admin</div>
        <nav className="admin-sidebar__nav admin-sidebar__nav--scroll" aria-label="Admin">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? 'admin-nav--active' : undefined)}
          >
            <LayoutDashboard size={16} aria-hidden />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? 'admin-nav--active' : undefined)}
          >
            <Users size={16} aria-hidden />
            Users
          </NavLink>
          {EDITOR_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => (isActive ? 'admin-nav--active' : undefined)}>
              <Icon size={16} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin-sidebar__storefront">
            View storefront
          </a>
          <button type="button" onClick={handleSignOut}>
            <LogOut size={14} aria-hidden />
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
