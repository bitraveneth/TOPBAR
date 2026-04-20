function AgeGateModal({ onAccept }) {
  return (
    <div className="age-gate-backdrop">
      <div className="age-gate-modal">
        <div className="brand">
          <img src="/images/topbar-logo.svg" alt="TOPBAR" className="brand-logo" />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Welcome to the official TOPBAR website
        </p>
        <h2>Age Certification</h2>
        <p>
          To use the TOPBAR website you must be aged 21 years or over. 
          Please verify your age before entering the site.
        </p>
        <p className="warning-text">
          WARNING: This product contains nicotine. Nicotine is an addictive chemical.
          Only for adults, MINORS are prohibited from buying e-cigarette.
        </p>
        <div className="age-actions">
          <button className="btn-primary" onClick={onAccept}>I am 21+</button>
          <button className="btn-ghost" onClick={() => window.history.back()}>Exit</button>
        </div>
      </div>
    </div>
  )
}

export default AgeGateModal
