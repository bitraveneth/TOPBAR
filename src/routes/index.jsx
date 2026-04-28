import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import About from '../pages/About'
import Support from '../pages/Support'
import Compliance from '../pages/Compliance'
import Downloads from '../pages/Downloads'
import News from '../pages/News'
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
  { path: '/news', element: <News /> },
  { path: '*', element: <NotFound /> },
]

export default routes

