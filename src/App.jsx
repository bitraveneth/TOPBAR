import { Routes, Route } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import AdminShell from './admin/AdminShell'
import routes from './routes'

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminShell />} />
      <Route element={<SiteLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
