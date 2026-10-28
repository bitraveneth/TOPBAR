/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { createElement } from 'react'
import { FileText, Download, ShieldCheck, PackageCheck } from 'lucide-react'
import { useCms } from '../contexts/useCms'

const RESOURCE_ICONS = [ShieldCheck, PackageCheck, FileText]

function DownloadLink({ file, icon = FileText }) {
  const ready = Boolean(file.url)
  return (
    <a
      href={ready ? file.url : undefined}
      className="download-item"
      download={ready || undefined}
      onClick={(event) => {
        if (!ready) event.preventDefault()
      }}
    >
      {createElement(icon, { size: 20, className: 'download-item__icon' })}
      <div className="download-item__meta">
        <span className="download-item__name">{file.title}</span>
        <span className="download-item__type">{[file.type, file.size].filter(Boolean).join(' · ') || 'File'}</span>
      </div>
      <Download size={16} className="download-item__arrow" />
    </a>
  )
}

function Downloads() {
  const { merged } = useCms()
  const page = merged.downloads || {}
  const groups = page.groups || []
  const resources = page.resources || []

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <p className="page-hero__eyebrow">{page.eyebrow || 'Resource Center'}</p>
          <h1>{page.title || 'Downloads'}</h1>
          <p>{page.intro}</p>
        </div>
      </div>

      <section className="section">
        <div className="container downloads-page">
          <div className="downloads-grid">
            {groups.map((group) => (
              <article key={group.id || group.title} className="downloads-card">
                <h2 className="downloads-card__title">{group.title}</h2>
                <div className="download-list">
                  {(group.files || []).map((file) => (
                    <DownloadLink key={file.id || file.title} file={file} />
                  ))}
                </div>
              </article>
            ))}
          </div>

          <article className="downloads-resource-card">
            <h2 className="downloads-card__title">Support Documents</h2>
            <div className="download-list">
              {resources.map((file, index) => (
                <DownloadLink key={file.id || file.title} file={file} icon={RESOURCE_ICONS[index] || FileText} />
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

export default Downloads
