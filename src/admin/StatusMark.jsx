/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { STATUS_LABELS } from '../lib/verifyFormat'

export default function StatusMark({ status }) {
  if (!status) return <span className="admin-status admin-status--muted">Unused</span>
  return (
    <span className={`admin-status admin-status--${status}`}>
      <i aria-hidden="true" />
      {STATUS_LABELS[status] || status}
    </span>
  )
}
