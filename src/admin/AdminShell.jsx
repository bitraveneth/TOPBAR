import { Navigate, Route, Routes } from 'react-router-dom'
import AdminProtected from './AdminProtected'
import AdminLayout from './AdminLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import CmsSiteForm from '../components/admin/cms/CmsSiteForm'
import CmsNavForm from '../components/admin/cms/CmsNavForm'
import CmsHomeForm from '../components/admin/cms/CmsHomeForm'
import CmsFooterForm from '../components/admin/cms/CmsFooterForm'
import CmsProductsForm from '../components/admin/cms/CmsProductsForm'
import CmsNewsletterForm from '../components/admin/cms/CmsNewsletterForm'
import CmsMediaLibrary from '../components/admin/cms/CmsMediaLibrary'
import CmsHistoryForm from '../components/admin/cms/CmsHistoryForm'
import CmsAdvancedJsonForm from '../components/admin/cms/CmsAdvancedJsonForm'
import '../styles/admin.css'

export default function AdminShell() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminProtected />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="site" element={<CmsSiteForm />} />
          <Route path="navigation" element={<CmsNavForm />} />
          <Route path="home" element={<CmsHomeForm />} />
          <Route path="footer" element={<CmsFooterForm />} />
          <Route path="products" element={<CmsProductsForm />} />
          <Route path="newsletter" element={<CmsNewsletterForm />} />
          <Route path="media" element={<CmsMediaLibrary />} />
          <Route path="revisions" element={<CmsHistoryForm />} />
          <Route path="json" element={<CmsAdvancedJsonForm />} />
          {/* Legacy URLs */}
          <Route path="cms" element={<Navigate to="/admin/site" replace />} />
          <Route path="cms/site" element={<Navigate to="/admin/site" replace />} />
          <Route path="cms/menu" element={<Navigate to="/admin/navigation" replace />} />
          <Route path="cms/home" element={<Navigate to="/admin/home" replace />} />
          <Route path="cms/footer" element={<Navigate to="/admin/footer" replace />} />
          <Route path="cms/products" element={<Navigate to="/admin/products" replace />} />
          <Route path="cms/newsletter" element={<Navigate to="/admin/newsletter" replace />} />
          <Route path="cms/media" element={<Navigate to="/admin/media" replace />} />
          <Route path="cms/history" element={<Navigate to="/admin/revisions" replace />} />
          <Route path="cms/advanced" element={<Navigate to="/admin/json" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
