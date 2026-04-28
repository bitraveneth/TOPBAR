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

const navClass = ({ isActive }) =>
  [
    'adm:flex adm:w-full adm:items-center adm:gap-2.5 adm:rounded-[var(--radius-admin)] adm:px-3 adm:py-2.5 adm:text-sm adm:font-semibold adm:transition-colors adm:duration-150 adm:no-underline',
    isActive
      ? 'adm:bg-brand adm:text-brand-fg'
      : 'adm:text-muted adm:hover:bg-brand/10 adm:hover:text-heading',
  ].join(' ')

export default function AdminLayout() {
  async function handleSignOut() {
    await supabase?.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="adm:flex adm:min-h-screen adm:bg-background adm:font-sans adm:text-fg">
      <aside
        className="adm:flex adm:h-screen adm:w-[260px] adm:shrink-0 adm:flex-col adm:border-r adm:border-border adm:bg-surface adm:px-3 adm:pb-4 adm:pt-5"
        aria-label="Sidebar"
      >
        <div className="adm:mb-5 adm:shrink-0 adm:px-2 adm:font-heading adm:text-sm adm:font-bold adm:uppercase adm:tracking-[0.12em] adm:text-brand">
          TOPBAR Admin
        </div>
        <nav
          className="adm:flex adm:min-h-0 adm:flex-1 adm:flex-col adm:gap-1 adm:overflow-y-auto adm:pr-0.5"
          aria-label="Admin"
        >
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard size={16} aria-hidden className="adm:shrink-0" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={navClass}>
            <Users size={16} aria-hidden className="adm:shrink-0" />
            Users
          </NavLink>
          {EDITOR_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={navClass}>
              <Icon size={16} aria-hidden className="adm:shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="adm:mt-auto adm:flex adm:shrink-0 adm:flex-col adm:gap-2 adm:border-t adm:border-border adm:pt-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="adm:inline-flex adm:items-center adm:justify-center adm:rounded-[var(--radius-admin)] adm:border adm:border-brand/45 adm:px-3 adm:py-2 adm:text-center adm:text-xs adm:font-semibold adm:uppercase adm:tracking-wide adm:text-brand adm:no-underline adm:transition-colors adm:hover:bg-brand/10"
          >
            View storefront
          </a>
          <button
            type="button"
            onClick={handleSignOut}
            className="adm:m-0 adm:inline-flex adm:cursor-pointer adm:items-center adm:justify-center adm:gap-2 adm:rounded-[var(--radius-admin)] adm:border adm:border-border adm:bg-transparent adm:px-3 adm:py-2 adm:text-xs adm:font-semibold adm:text-muted adm:transition-colors adm:hover:border-brand/50 adm:hover:text-brand"
          >
            <LogOut size={14} aria-hidden />
            Sign out
          </button>
        </div>
      </aside>
      <main className="adm:min-h-screen adm:flex-1 adm:overflow-x-auto adm:bg-background adm:px-5 adm:py-8 lg:adm:px-10">
        <Outlet />
      </main>
    </div>
  )
}
