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
import ProductsAdmin from './admin/ProductsAdmin'
import ProductEditor from './admin/ProductEditor'
import HomepageAdmin from './admin/HomepageAdmin'
import ExhibitionAdmin from './admin/ExhibitionAdmin'
import DownloadsAdmin from './admin/DownloadsAdmin'
import SupportAdmin from './admin/SupportAdmin'
import MediaAdmin from './admin/MediaAdmin'
import UsersPage from './admin/UsersPage'
import { RequireAccess } from './admin/adminSession'

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="codes" replace />} />
        <Route path="codes" element={<CodesPage />} />
        <Route path="codes/import" element={<ImportPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="products" element={<RequireAccess permission="content"><ProductsAdmin /></RequireAccess>} />
        <Route path="products/:slug" element={<RequireAccess permission="content"><ProductEditor /></RequireAccess>} />
        <Route path="homepage" element={<RequireAccess permission="content"><HomepageAdmin /></RequireAccess>} />
        <Route path="exhibition" element={<RequireAccess permission="content"><ExhibitionAdmin /></RequireAccess>} />
        <Route path="downloads" element={<RequireAccess permission="content"><DownloadsAdmin /></RequireAccess>} />
        <Route path="support" element={<RequireAccess permission="content"><SupportAdmin /></RequireAccess>} />
        <Route path="media" element={<RequireAccess permission="content"><MediaAdmin /></RequireAccess>} />
        <Route path="users" element={<RequireAccess permission="users"><UsersPage /></RequireAccess>} />
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
