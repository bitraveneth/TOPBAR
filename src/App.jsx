/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import routes from './routes'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import CodesPage from './admin/CodesPage'
import ImportPage from './admin/ImportPage'
import ActivityPage from './admin/ActivityPage'

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="codes" replace />} />
        <Route path="codes" element={<CodesPage />} />
        <Route path="codes/import" element={<ImportPage />} />
        <Route path="activity" element={<ActivityPage />} />
      </Route>
      <Route element={<SiteLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
