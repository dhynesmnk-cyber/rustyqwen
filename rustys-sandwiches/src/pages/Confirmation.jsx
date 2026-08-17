import { useLocation, Link } from 'react-router-dom';
import '../styles/Confirmation.css';

export default function Confirmation() {
  const location = useLocation();
  const { orderId, order } = location.state || {};

  // Fallback demo data if no order state
  const displayOrderId = orderId || 'DEMO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderNumber = displayOrderId.split('-').pop() || '1234';

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="confirmation-title">Order Confirmed!</h1>
          
          <p className="confirmation-message">
            Thanks, your order has been received. Please pay at the counter when you collect your order.
          </p>

          <div className="order-details-card card">
            <div className="detail-row">
              <span className="detail-label">Order Number:</span>
              <span className="detail-value">#{orderNumber}</span>
            </div>
            
            {order?.fulfillments?.[0]?.pickup_details && (
              <>
                <div className="detail-row">
                  <span className="detail-label">Pickup Time:</span>
                  <span className="detail-value">
                    {new Date(order.fulfillments[0].pickup_details.pickup_at).toLocaleString('en-AU', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    {order.fulfillments[0].pickup_details.recipient?.display_name || 'Customer'}
                  </span>
                </div>
              </>
            )}

            {order?.total && (
              <div className="detail-row total-row">
                <span className="detail-label">Total Due:</span>
                <span className="detail-value total-amount">
                  ${(order.total / 100).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="pickup-info-card">
            <h2 className="info-title">When You Arrive</h2>
            <ol className="info-steps">
              <li>Enter Rusty's Sandwich Parlour</li>
              <li>Provide your order number to staff</li>
              <li>Pay for your order at the counter</li>
              <li>Wait for your fresh sandwiches to be prepared</li>
              <li>Enjoy your meal!</li>
            </ol>
          </div>

          <div className="contact-info">
            <p>
              <strong>Need help?</strong> Contact us at{' '}
              <a href="tel:+61400123456">(02) 1234 5678</a>
            </p>
            <p className="venue-address">
              Rusty's Sandwich Parlour<br />
              123 Main Street<br />
              Melbourne VIC 3000
            </p>
          </div>

          <div className="confirmation-actions">
            <Link to="/menu" className="btn btn-secondary">
              Order More
            </Link>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
