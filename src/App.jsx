/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import routes from './routes'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
