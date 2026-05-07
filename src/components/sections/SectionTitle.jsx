/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className="section-header" style={align === 'center' ? { textAlign: 'center' } : undefined}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && (
        <p style={align === 'center' ? { marginInline: 'auto' } : undefined}>{description}</p>
      )}
    </div>
  )
}

export default SectionTitle
