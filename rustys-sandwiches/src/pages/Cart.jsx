import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h1>Your Cart</h1>
          <p>Your cart is empty.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Cart</h1>
        
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={`${item.variationId}-${index}`} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.itemName}</h3>
                <p className="cart-variation">{item.variationName}</p>
                {item.selectedModifiers?.length > 0 && (
                  <ul className="cart-modifiers">
                    {item.selectedModifiers.map(mod => (
                      <li key={mod.id}>{mod.modifier_data?.name}</li>
                    ))}
                  </ul>
                )}
                <div className="cart-price">
                  ${((item.priceAmount + (item.selectedModifiers?.reduce((sum, m) => sum + (m.modifier_data?.price_money?.amount || 0), 0) || 0)) / 100).toFixed(2)}
                </div>
              </div>
              
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Total</span>
            <span className="summary-total">${getCartTotal().toFixed(2)}</span>
          </div>
          
          <div className="cart-actions">
            <Link to="/menu" className="btn btn-secondary">Continue Shopping</Link>
            <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
