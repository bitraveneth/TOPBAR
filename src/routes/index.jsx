/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import About from '../pages/About'
import Support from '../pages/Support'
import Compliance from '../pages/Compliance'
import Downloads from '../pages/Downloads'
import Exhibition from '../pages/Exhibition'
import NotFound from '../pages/NotFound'
import VerifyProducts from '../pages/VerifyProducts'

const routes = [
  { path: '/', element: <Home /> },
  { path: '/products', element: <Products /> },
  { path: '/products/:slug', element: <ProductDetail /> },
  { path: '/about', element: <About /> },
  { path: '/verify-products', element: <VerifyProducts /> },
  { path: '/support', element: <Support /> },
  { path: '/compliance', element: <Compliance /> },
  { path: '/downloads', element: <Downloads /> },
  { path: '/exhibition', element: <Exhibition /> },
  { path: '*', element: <NotFound /> },
]

export default routes

