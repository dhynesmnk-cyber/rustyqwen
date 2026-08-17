import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createOrder, getAvailablePickupTimes, formatPickupTime, generateIdempotencyKey } from '../lib/square';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupTime: '',
    notes: '',
  });
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const pickupTimes = getAvailablePickupTimes();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart-state">
            <h1>Your cart is empty</h1>
            <p>Add some delicious sandwiches before checking out!</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acknowledged) {
      setError('Please acknowledge that you will pay at the venue.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        idempotencyKey: generateIdempotencyKey(),
        items: cartItems.map(item => ({
          catalogObjectId: item.variationId,
          quantity: item.quantity,
          modifiers: item.modifiers?.map(m => m.id) || [],
        })),
        customer: {
          name: formData.name,
          phone: formData.phone,
        },
        pickupTime: formData.pickupTime,
        notes: formData.notes,
      };

      const result = await createOrder(orderData);
      
      // Clear cart and redirect to confirmation
      clearCart();
      navigate('/confirmation', { 
        state: { 
          orderId: result.order?.id,
          order: result.order,
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to create order. Please try again.');
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <header className="page-header">
          <h1 className="section-heading">Checkout</h1>
          <p className="page-subtitle">Complete your order for pickup</p>
        </header>

        <div className="checkout-grid">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  pattern="[0-9+\-\s()]{7,}"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pickupTime" className="form-label">
                  Pickup Time *
                </label>
                <select
                  id="pickupTime"
                  name="pickupTime"
                  className="form-select"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a pickup time</option>
                  {pickupTimes.map((time) => (
                    <option key={time} value={time}>
                      {formatPickupTime(time)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-textarea"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions or allergies..."
                  rows={3}
                />
              </div>

              <div className="acknowledgement-section">
                <label className="acknowledgement-label">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    required
                  />
                  <span className="acknowledgement-text">
                    I understand that I must pay for this order when I collect it from Rusty's Sandwich Parlour. 
                    Payment is not taken online.
                  </span>
                </label>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-strong btn-large submit-order-btn"
                disabled={submitting || !acknowledged}
              >
                {submitting ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="order-summary-section">
            <div className="order-summary-card card">
              <h2 className="summary-title">Order Summary</h2>
              
              <ul className="summary-items">
                {cartItems.map((item, index) => (
                  <li key={index} className="summary-item">
                    <div className="summary-item-details">
                      <span className="summary-item-name">{item.name}</span>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <ul className="summary-modifiers">
                          {item.modifiers.map((mod, i) => (
                            <li key={i} className="summary-modifier">+ {mod.name}</li>
                          ))}
                        </ul>
                      )}
                      <span className="summary-item-quantity">x{item.quantity}</span>
                    </div>
                    <span className="summary-item-price">
                      ${(item.price + (item.modifiers || []).reduce((sum, m) => sum + (m.price || 0), 0) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="summary-total">
                <span>Total Due:</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>

              <p className="payment-reminder">
                <strong>Remember:</strong> Pay at the counter when you collect your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
