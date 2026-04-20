import { FileText, Download } from 'lucide-react'

const files = [
  { name: 'Aegis Legend 5 User Manual', type: 'PDF', size: '4.2 MB' },
  { name: 'Force Quick Start Guide', type: 'PDF', size: '1.8 MB' },
  { name: 'Wenax Q2 Quick Start Guide', type: 'PDF', size: '1.2 MB' },
  { name: 'Z Nano 3 Tank Setup Guide', type: 'PDF', size: '2.1 MB' },
  { name: 'AS Chip Firmware Utility', type: 'EXE', size: '12.5 MB' },
  { name: 'Warranty Terms & Conditions', type: 'PDF', size: '0.8 MB' },
  { name: 'Product Safety Datasheet', type: 'PDF', size: '1.5 MB' },
  { name: 'Compliance Certificates Pack', type: 'ZIP', size: '8.3 MB' },
]

function Downloads() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Downloads</h1>
          <p>Access product manuals, software utilities, warranty documents, and compliance materials.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="download-list">
            {files.map((file) => (
              <div key={file.name} className="download-item">
                <FileText size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <a href="#">{file.name}</a>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {file.type} · {file.size}
                  </span>
                </div>
                <Download size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Downloads
