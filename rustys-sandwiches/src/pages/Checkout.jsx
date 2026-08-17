import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/square';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pickupTime: '',
    notes: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      alert('Please confirm that you understand payment is required at the venue.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        customerName: formData.name,
        phoneNumber: formData.phone,
        pickupTime: formData.pickupTime,
        notes: formData.notes,
        items: cartItems,
      };

      const result = await createOrder(orderData);
      
      clearCart();
      navigate('/confirmation', { 
        state: { 
          orderId: result.order?.id,
          orderNumber: result.order?.name,
          total: getCartTotal(),
          pickupTime: formData.pickupTime,
          customerName: formData.name,
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to create order. Please try again.');
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Generate available pickup times
  const generatePickupTimes = () => {
    const times = [];
    const now = new Date();
    const minLeadMinutes = parseInt(import.meta.env.VITE_ORDER_MIN_LEAD_MINUTES) || 15;
    const maxDaysAhead = parseInt(import.meta.env.VITE_ORDER_MAX_DAYS_AHEAD) || 7;
    
    for (let day = 0; day < maxDaysAhead; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Business hours: 9am - 5pm
      for (let hour = 9; hour <= 16; hour++) {
        for (let minute of [0, 30]) {
          const timeSlot = new Date(date);
          timeSlot.setHours(hour, minute, 0, 0);
          
          // Skip past times
          const minPickupTime = new Date(now.getTime() + minLeadMinutes * 60000);
          if (timeSlot < minPickupTime) continue;
          
          times.push(timeSlot);
        }
      }
    }
    
    return times;
  };

  const availableTimes = generatePickupTimes();

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>Contact Details</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="0400 123 456"
                pattern="[0-9\s+]+"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Pickup Time</h2>
            
            <div className="form-group">
              <label htmlFor="pickupTime">Preferred Pickup Time *</label>
              <select
                id="pickupTime"
                name="pickupTime"
                required
                value={formData.pickupTime}
                onChange={handleChange}
              >
                <option value="">Select a time</option>
                {availableTimes.map((time, index) => (
                  <option key={index} value={time.toISOString()}>
                    {formatPickupTime(time)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Order Notes (Optional)</h2>
            
            <div className="form-group">
              <label htmlFor="notes">Special Instructions</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any allergies, preferences, or special requests?"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Order Summary</h2>
            
            <div className="order-summary">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span className="summary-item-name">
                    {item.quantity}x {item.itemName}
                  </span>
                  <span className="summary-item-price">
                    ${(item.priceAmount / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="summary-total-row">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="payment-warning">
            <div className="warning-box">
              <h3>⚠️ Payment Required at Venue</h3>
              <p>
                By placing this order, you agree to collect it from Rusty's Sandwich Parlour 
                and pay for it at the venue. <strong>Payment is not taken online.</strong>
              </p>
            </div>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I understand that I must pay for this order when I collect it.</span>
            </label>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={submitting || !agreed}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

function formatPickupTime(date) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleString('en-AU', options);
}

export default Checkout;
