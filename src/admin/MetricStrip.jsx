/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export default function MetricStrip({ items }) {
  return (
    <section className="admin-metrics" aria-label="Summary">
      {items.map((item) => (
        <div key={item.label} className="admin-metric">
          <strong>{item.value}</strong>
          <span>{item.label}</span>
          {item.hint ? <em>{item.hint}</em> : null}
        </div>
      ))}
    </section>
  )
}
