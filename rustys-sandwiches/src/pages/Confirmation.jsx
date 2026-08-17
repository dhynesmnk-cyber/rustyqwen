import { Link, useLocation } from 'react-router-dom';
import './Confirmation.css';

function Confirmation() {
  const location = useLocation();
  const { orderId, orderNumber, total, pickupTime, customerName } = location.state || {};

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        
        <h1>Order Confirmed!</h1>
        
        <p className="confirmation-message">
          Thanks, your order has been received. Please pay at the counter when you collect your order.
        </p>

        <div className="order-details">
          {customerName && (
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{customerName}</span>
            </div>
          )}
          
          {orderNumber && (
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">{orderNumber}</span>
            </div>
          )}
          
          {orderId && (
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{orderId.substring(0, 12)}...</span>
            </div>
          )}
          
          {pickupTime && (
            <div className="detail-row">
              <span className="detail-label">Pickup Time:</span>
              <span className="detail-value">{formatPickupTime(pickupTime)}</span>
            </div>
          )}
          
          {total !== undefined && (
            <div className="detail-row detail-total">
              <span className="detail-label">Total Due:</span>
              <span className="detail-value">${total.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="payment-reminder">
          <h3>⚠️ Remember to Pay In Store</h3>
          <p>
            This order has been created as an open ticket in our system. 
            Please proceed to the counter to complete payment when you arrive.
          </p>
        </div>

        <div className="confirmation-actions">
          <Link to="/menu" className="btn btn-secondary">Order More</Link>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>

        <div className="help-info">
          <p>
            Need to change or cancel your order? Please contact us directly as soon as possible.
          </p>
        </div>
      </div>
    </div>
  );
}

function formatPickupTime(isoString) {
  try {
    const date = new Date(isoString);
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
  } catch {
    return isoString;
  }
}

export default Confirmation;
