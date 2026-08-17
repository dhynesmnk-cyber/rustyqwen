import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/square';
import '../styles/CartDrawer.css';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (!isCartOpen) return null;

  const total = getCartTotal();

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button 
            className="close-button" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item">
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <ul className="cart-item-modifiers">
                      {item.modifiers.map((mod, i) => (
                        <li key={i} className="modifier-item">+ {mod.name}</li>
                      ))}
                    </ul>
                  )}
                  <div className="cart-item-price">
                    {formatPrice((item.price + (item.modifiers || []).reduce((sum, m) => sum + (m.price || 0), 0)) * 100)}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(index)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-amount">{formatPrice(total * 100)}</span>
            </div>
            <div className="cart-actions">
              <button 
                className="btn btn-secondary clear-cart" 
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <a href="/checkout" className="btn btn-primary checkout-btn">
                Checkout
              </a>
            </div>
            <p className="payment-note">
              Payment required at venue when collecting your order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
