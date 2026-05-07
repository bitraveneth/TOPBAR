/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { FileText, Download, ShieldCheck, PackageCheck } from 'lucide-react'

const productDownloads = [
  {
    product: 'TOPBAR 8000 Puffs',
    files: [
      { name: 'TOPBAR 8000 User Manual', type: 'PDF', size: '3.1 MB' },
      { name: 'TOPBAR 8000 Quick Start Guide', type: 'PDF', size: '1.4 MB' },
    ],
  },
  {
    product: 'TOPBAR 9900 Puffs',
    files: [
      { name: 'TOPBAR 9900 User Manual', type: 'PDF', size: '3.6 MB' },
      { name: 'TOPBAR 9900 Quick Start Guide', type: 'PDF', size: '1.7 MB' },
    ],
  },
  {
    product: 'TOPBAR 50000 Puffs',
    files: [
      { name: 'TOPBAR 50000 User Manual', type: 'PDF', size: '4.3 MB' },
      { name: 'TOPBAR 50000 Setup & Safety Guide', type: 'PDF', size: '2.2 MB' },
    ],
  },
  {
    product: 'TOPBAR 60000 Puffs',
    files: [
      { name: 'TOPBAR 60000 User Manual', type: 'PDF', size: '4.6 MB' },
      { name: 'TOPBAR 60000 Setup & Safety Guide', type: 'PDF', size: '2.5 MB' },
    ],
  },
]

const resourceDownloads = [
  { name: 'Warranty Terms & Conditions', type: 'PDF', size: '0.8 MB', icon: ShieldCheck },
  { name: 'Product Safety Datasheet', type: 'PDF', size: '1.5 MB', icon: PackageCheck },
  { name: 'Compliance Certificates Pack', type: 'ZIP', size: '8.3 MB', icon: FileText },
]

function Downloads() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">Resource Center</p>
          <h1>Downloads</h1>
          <p>Access official TOPBAR manuals, quick start guides, safety files, and compliance documents.</p>
        </div>
      </div>

      <section className="section">
        <div className="container downloads-page">
          <div className="downloads-grid">
            {productDownloads.map((group) => (
              <article key={group.product} className="downloads-card">
                <h2 className="downloads-card__title">{group.product}</h2>
                <div className="download-list">
                  {group.files.map((file) => (
                    <a key={file.name} href="#" className="download-item">
                      <FileText size={20} className="download-item__icon" />
                      <div className="download-item__meta">
                        <span className="download-item__name">{file.name}</span>
                        <span className="download-item__type">{file.type} · {file.size}</span>
                      </div>
                      <Download size={16} className="download-item__arrow" />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <article className="downloads-resource-card">
            <h2 className="downloads-card__title">Support Documents</h2>
            <div className="download-list">
              {resourceDownloads.map((file) => (
                <a key={file.name} href="#" className="download-item">
                  <file.icon size={20} className="download-item__icon" />
                  <div className="download-item__meta">
                    <span className="download-item__name">{file.name}</span>
                    <span className="download-item__type">{file.type} · {file.size}</span>
                  </div>
                  <Download size={16} className="download-item__arrow" />
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default Downloads
