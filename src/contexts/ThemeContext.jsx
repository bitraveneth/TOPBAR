/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './themeSharedContext'

const STORAGE_KEY = 'topbar-theme'

function getInitialTheme() {
  return 'light'
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    root.dataset.theme = theme
    root.style.colorScheme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)

    const id = window.setTimeout(() => {
      root.classList.remove('theme-switching')
    }, 240)

    return () => {
      window.clearTimeout(id)
      root.classList.remove('theme-switching')
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
