/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { createContext, useContext } from 'react'

export const AdminSessionContext = createContext(null)

const STORAGE_KEY = 'topbar-admin-session-user'

export function readStoredUser() {
  try {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
    if (!user?.permissions) return null
    return user
  } catch {
    return null
  }
}

export function storeUser(user) {
  if (user?.permissions) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else sessionStorage.removeItem(STORAGE_KEY)
}

export function useAdminSession() {
  const value = useContext(AdminSessionContext)
  if (!value) throw new Error('Missing admin session')
  return value
}
