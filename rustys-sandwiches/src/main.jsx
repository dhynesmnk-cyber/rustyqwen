import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './hooks/useCart'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MenuItemDetail from './pages/MenuItemDetail'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Catering from './pages/Catering'
import Delivery from './pages/Delivery'
import './styles/variables.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Header />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuItemDetail />} />
          <Route path="/cart" element={<Checkout />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/delivery" element={<Delivery />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
