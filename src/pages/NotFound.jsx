import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '8rem 1rem' }}>
      <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 900, color: 'var(--border-light)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ marginBottom: '0.75rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        The page you requested does not exist in this template.
      </p>
      <Link to="/" className="btn-primary">Back to Homepage</Link>
    </div>
  )
}

export default NotFound
