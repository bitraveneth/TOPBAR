/** Roles that may use /admin (dashboard + panel). */
export const STAFF_ROLES = ['admin', 'owner']

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role)
}
