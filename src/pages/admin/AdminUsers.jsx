import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AdminUsers() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
  })
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    if (!supabase) return
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) {
      setMsg({ type: 'err', text: error.message })
      setRows([])
      return
    }
    setRows(data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreateUser(e) {
    e.preventDefault()
    setMsg({ type: '', text: '' })
    if (!supabase) return
    setSubmitting(true)
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: {
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim(),
        role: form.role,
      },
    })
    setSubmitting(false)
    if (error) {
      setMsg({ type: 'err', text: error.message })
      return
    }
    if (data?.error) {
      setMsg({ type: 'err', text: data.error })
      return
    }
    setMsg({ type: 'ok', text: 'User created.' })
    setForm({ email: '', password: '', full_name: '', role: 'user' })
    load()
  }

  return (
    <>
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-sub">
        Create accounts via the secured Edge Function (service role never ships to the browser).
        Deploy <code style={{ color: 'var(--accent)' }}>admin-create-user</code> in Supabase first.
      </p>

      <div className="admin-panel" style={{ marginBottom: '2rem' }}>
        <h2>Add user</h2>
        <form onSubmit={handleCreateUser}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="nu-email">Email</label>
              <input
                id="nu-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="nu-pass">Password (min 8)</label>
              <input
                id="nu-pass"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="nu-name">Full name</label>
              <input
                id="nu-name"
                type="text"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="nu-role">Role</label>
              <select
                id="nu-role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
          </div>
          <button type="submit" className="admin-btn" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create user'}
          </button>
          {msg.text ? (
            <p className={`admin-msg ${msg.type === 'ok' ? 'admin-msg--ok' : 'admin-msg--err'}`}>
              {msg.text}
            </p>
          ) : null}
        </form>
      </div>

      <div className="admin-panel">
        <h2>All profiles</h2>
        {loading ? (
          <p className="admin-msg">Loading…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.email ?? '—'}</td>
                    <td>{r.full_name || '—'}</td>
                    <td>{r.role}</td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
