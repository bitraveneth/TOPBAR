import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { isStaffRole } from '../lib/adminRoles'

export default function AdminProtected() {
  const location = useLocation()
  const [state, setState] = useState({ loading: true, ok: false })

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setState({ loading: false, ok: false })
      return
    }

    let cancelled = false

    async function run() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        if (!cancelled) setState({ loading: false, ok: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!cancelled) {
        setState({ loading: false, ok: isStaffRole(profile?.role) })
      }
    }

    run()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      run()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  if (!isSupabaseConfigured) {
    return <Navigate to="/admin/login" replace state={{ from: location, misconfigured: true }} />
  }

  if (state.loading) {
    return (
      <div className="admin-root admin-loading" aria-busy="true">
        Checking session…
      </div>
    )
  }

  if (!state.ok) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
