import { useState, useEffect } from 'react'
import './index.css'

const MENU_ITEMS = [
  {
    id: 1,
    name: 'The Rusty Special',
    description: 'Slow-roasted beef, caramelized onions, horseradish cream on sourdough',
    price: 12.50,
    image: 'https://rustyssandwichparlour.square.site/file/8d4c6e8f-2b1a-4c5e-9f3d-1a2b3c4d5e6f.jpg'
  },
  {
    id: 2,
    name: 'Chicken Schnitzel',
    description: 'Crispy chicken breast, lettuce, tomato, mayo on Turkish bread',
    price: 11.00,
    image: 'https://rustyssandwichparlour.square.site/file/7c3b5d7e-1a0b-3c4d-8e2f-0a1b2c3d4e5f.jpg'
  },
  {
    id: 3,
    name: 'Pulled Pork',
    description: '12-hour smoked pork, coleslaw, BBQ sauce on brioche',
    price: 13.00,
    image: 'https://rustyssandwichparlour.square.site/file/6b2a4c6d-0a9b-2c3d-7e1f-9a0b1c2d3e4f.jpg'
  },
  {
    id: 4,
    name: 'Veggie Delight',
    description: 'Grilled haloumi, roasted capsicum, spinach, pesto on focaccia',
    price: 10.50,
    image: 'https://rustyssandwichparlour.square.site/file/5a1b3c5d-9a8b-1c2d-6e0f-8a9b0c1d2e3f.jpg'
  }
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    phone: '',
    pickupTime: ''
  })
  const [orderNumber, setOrderNumber] = useState(null)

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i)
      }
      return [...prev, {...item, quantity: 1}]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId))
  }

  const updateQuantity = (itemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.quantity + delta
        return newQty > 0 ? {...item, quantity: newQty} : item
      }
      return item
    }).filter(i => i.quantity > 0))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = (e) => {
    e.preventDefault()
    const orderNum = Math.floor(Math.random() * 9000) + 1000
    setOrderNumber(orderNum)
    setCart([])
    setCurrentPage('confirmation')
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <>
      <header className="header">
        <div className="logo">Rusty's</div>
        <button className="cart-button" onClick={() => setIsCartOpen(true)}>
          Cart ({cartCount})
        </button>
      </header>

      {currentPage === 'home' && (
        <main>
          <section className="hero">
            <h1>Rusty's<br/>Sandwich Parlour</h1>
            <p>Bold flavours. Natural ingredients. Proper sandwiches.</p>
            <button onClick={() => setCurrentPage('menu')}>Order Now</button>
          </section>

          <section className="menu-section">
            <h2>The Menu</h2>
            <div className="menu-grid">
              {MENU_ITEMS.map(item => (
                <div key={item.id} className="menu-item">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="price">${item.price.toFixed(2)}</span>
                    <button className="add-btn" onClick={() => addToCart(item)}>Add to Order</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {currentPage === 'checkout' && (
        <div className="checkout-page">
          <h2>Your Details</h2>
          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label>Name</label>
              <input 
                required 
                type="text" 
                value={checkoutData.name}
                onChange={e => setCheckoutData({...checkoutData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                required 
                type="tel" 
                value={checkoutData.phone}
                onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Pickup Time</label>
              <input 
                required 
                type="datetime-local" 
                value={checkoutData.pickupTime}
                onChange={e => setCheckoutData({...checkoutData, pickupTime: e.target.value})}
              />
            </div>
            <button type="submit" className="submit-btn">Place Order</button>
          </form>
        </div>
      )}

      {currentPage === 'confirmation' && (
        <div className="confirmation">
          <h2>Order Confirmed!</h2>
          <div className="order-number">#{orderNumber}</div>
          <p>
            Pick up your order at Rusty's Sandwich Parlour.<br/>
            Pay when you collect.
          </p>
          <button 
            onClick={() => {
              setCurrentPage('home')
              setOrderNumber(null)
            }}
            style={{marginTop: '32px', background: 'var(--orange-logo)', color: 'var(--text-light)'}}
          >
            Back to Home
          </button>
        </div>
      )}

      {isCartOpen && (
        <>
          <div 
            className="cart-overlay" 
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 1999
            }}
          />
          <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
            <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
            <h2>Your Order</h2>
            {cart.length === 0 ? (
              <p style={{color: 'var(--concrete-dark)'}}>Cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <strong style={{color: 'var(--text-dark)'}}>{item.name}</strong>
                      <div style={{color: 'var(--orange-logo)', fontSize: '14px'}}>
                        ${item.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        style={{background: 'var(--concrete-dark)', color: '#fff', padding: '8px 12px', marginRight: '8px', border: 'none', cursor: 'pointer', fontFamily: 'monospace'}}
                      >-</button>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        style={{background: 'var(--concrete-dark)', color: '#fff', padding: '8px 12px', marginRight: '8px', border: 'none', cursor: 'pointer', fontFamily: 'monospace'}}
                      >+</button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{background: 'var(--orange-logo)', color: '#fff', padding: '8px 12px', border: 'none', cursor: 'pointer', fontFamily: 'monospace'}}
                      >×</button>
                    </div>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ${cartTotal.toFixed(2)}
                </div>
                <button 
                  className="checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false)
                    setCurrentPage('checkout')
                  }}
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default App
