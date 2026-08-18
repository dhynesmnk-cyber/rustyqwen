import { useCart } from '../hooks/useCart';
import './CartDrawer.css';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCart();

  const total = getCartTotal();

  return (
    <>
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      )}
      
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <header className="cart-header">
          <h2>Your Order</h2>
          <button 
            className="close-cart"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </header>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your cart is empty</p>
              <span>Add some delicious items to get started</span>
            </div>
          ) : (
            <>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.variationId}`} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.variationId, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.variationId, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="remove-item"
                        onClick={() => removeFromCart(item.id, item.variationId)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>
                <button className="checkout-btn btn btn-primary btn-large">
                  Proceed to Checkout
                </button>
                <p className="checkout-note">Pay when you collect your order</p>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
