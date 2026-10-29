/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useAdminSession } from './adminSession'

export default function RequireAccess({ permission, children }) {
  const { user } = useAdminSession()
  if (user.permissions.includes(permission)) return children
  return (
    <div className="admin-page">
      <h1>No access</h1>
      <p>Your account cannot open this section.</p>
    </div>
  )
}
