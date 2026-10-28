/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../lib/adminApi'
import { useAdminSession } from './adminSession'

const ROLES = [
  ['superadmin', 'Super admin', 'Users, website, and codes'],
  ['admin', 'Admin', 'Website and codes'],
  ['staff', 'Staff', 'Codes, import, and activity'],
]

const emptyForm = { displayName: '', username: '', password: '', role: 'staff' }

function roleLabel(role) {
  return ROLES.find((item) => item[0] === role)?.[1] || role
}

function PasswordReset({ onSave }) {
  const [password, setPassword] = useState('')
  return (
    <label className="admin-field">
      <span>New password</span>
      <div className="media-field__row">
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="At least 8 characters" />
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { if (password) { onSave(password); setPassword('') } }}>Update</button>
      </div>
    </label>
  )
}

export default function UsersPage() {
  const navigate = useNavigate()
  const { user } = useAdminSession()
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  function load() {
    return adminFetch('/api/admin/users')
      .then((data) => setItems(data.items))
      .catch((err) => {
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else setError(err.message)
      })
  }

  useEffect(() => {
    let cancelled = false
    adminFetch('/api/admin/users')
      .then((data) => { if (!cancelled) setItems(data.items) })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 401) navigate('/admin/login', { replace: true })
        else setError(err.message)
      })
    return () => { cancelled = true }
  }, [navigate])

  async function createUser(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await adminFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(form) })
      setForm(emptyForm)
      setNotice('User added.')
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function updateUser(id, patch) {
    setError('')
    setNotice('')
    try {
      await adminFetch(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
      setNotice('User updated.')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeUser(person) {
    if (!window.confirm(`Remove ${person.username}?`)) return
    setError('')
    try {
      await adminFetch(`/api/admin/users/${person.id}`, { method: 'DELETE' })
      setNotice('User removed.')
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page cms-stack">
      <header className="admin-page__head">
        <div>
          <h1>Users</h1>
          <p>Super admin manages accounts. Admin edits the website. Staff works on codes.</p>
        </div>
      </header>

      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-note">{notice}</p> : null}

      <form className="cms-card" onSubmit={createUser}>
        <div className="cms-card__head">
          <h2>Add a user</h2>
        </div>
        <div className="cms-grid">
          <label className="admin-field">
            <span>Name</span>
            <input value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} required />
          </label>
          <label className="admin-field">
            <span>Username</span>
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} autoComplete="off" required />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="new-password" required />
          </label>
        </div>
        <div className="role-choices">
          {ROLES.map(([value, label, detail]) => (
            <button
              key={value}
              type="button"
              className={form.role === value ? 'role-choice is-selected' : 'role-choice'}
              onClick={() => setForm({ ...form, role: value })}
            >
              <strong>{label}</strong>
              <span>{detail}</span>
            </button>
          ))}
        </div>
        <div className="code-create__actions">
          <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving…' : 'Add user'}</button>
        </div>
      </form>

      <section className="user-list">
        {(items || []).map((person) => (
          <article key={person.id} className="cms-card user-card">
            <div className="cms-card__head">
              <div>
                <h2>{person.displayName}</h2>
                <p>{person.username}{person.id === user.id ? ' · You' : ''}</p>
              </div>
              <span className={`role-pill role-pill--${person.role}`}>{roleLabel(person.role)}</span>
            </div>
            <div className="user-card__row">
              <label className="admin-field">
                <span>Role</span>
                <select
                  value={person.role}
                  disabled={person.id === user.id}
                  onChange={(event) => updateUser(person.id, { role: event.target.value })}
                >
                  {ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <PasswordReset onSave={(password) => updateUser(person.id, { password })} />
            </div>
            <div className="code-create__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={person.id === user.id}
                onClick={() => updateUser(person.id, { active: !person.active })}
              >
                {person.active ? 'Disable' : 'Enable'}
              </button>
              <button type="button" className="admin-btn admin-btn--danger" disabled={person.id === user.id} onClick={() => removeUser(person)}>
                Remove
              </button>
            </div>
            {!person.active ? <p className="admin-note">This account cannot sign in.</p> : null}
          </article>
        ))}
      </section>
    </div>
  )
}
