/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export const ROLES = ['superadmin', 'admin', 'staff']

const MATRIX = {
  superadmin: ['codes', 'content', 'users'],
  admin: ['codes', 'content'],
  staff: ['codes'],
}

export function permissionsFor(role) {
  return MATRIX[role] ? [...MATRIX[role]] : []
}

export function hasPermission(role, name) {
  return permissionsFor(role).includes(name)
}

export function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    active: user.active,
    permissions: permissionsFor(user.role),
  }
}
