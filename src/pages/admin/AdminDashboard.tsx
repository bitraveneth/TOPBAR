import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: null, subscribers: null })

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    ;(async () => {
      const [{ count: users }, { count: subscribers }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      ])
      if (!cancelled) setStats({ users: users ?? 0, subscribers: subscribers ?? 0 })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Overview of users and newsletter signups.</p>
      <div className="admin-stat-grid">
        <div className="admin-stat">
          <div className="admin-stat__label">Users</div>
          <div className="admin-stat__value">{stats.users === null ? '—' : stats.users}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Newsletter</div>
          <div className="admin-stat__value">
            {stats.subscribers === null ? '—' : stats.subscribers}
          </div>
        </div>
      </div>
    </>
  )
}
