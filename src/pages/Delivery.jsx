import '../styles/StaticPages.css';

export default function Delivery() {
  return (
    <div className="static-page">
      <div className="container">
        <header className="page-header">
          <h1 className="section-heading">Delivery Information</h1>
        </header>

        <div className="static-content card">
          <p className="intro-text">
            Looking to have your Rusty's Sandwich Parlour favourites delivered? 
            Here's everything you need to know about our delivery options and service areas.
          </p>

          <h2>Current Delivery Status</h2>
          <div className="info-box highlight">
            <p>
              <strong>Note:</strong> Our online ordering system currently supports pickup orders only. 
              Delivery arrangements are handled separately through direct contact with our venue.
            </p>
          </div>

          <h2>Delivery Options</h2>
          <ul className="feature-list">
            <li>
              <strong>Local Delivery:</strong> We offer limited local delivery within a 5km radius of our venue 
              for large catering orders (minimum $100). Delivery fees apply based on distance and order size.
            </li>
            <li>
              <strong>Third-Party Delivery:</strong> We partner with select delivery platforms. 
              Check Uber Eats, DoorDash, or Menulog for our current delivery availability and menu offerings.
            </li>
            <li>
              <strong>Corporate Delivery:</strong> Regular corporate clients can arrange ongoing delivery services. 
              Contact us to set up a corporate account with invoicing options.
            </li>
          </ul>

          <h2>Delivery Areas</h2>
          <p>We currently deliver to the following Melbourne suburbs:</p>
          <ul className="suburb-list">
            <li>Melbourne CBD</li>
            <li>South Yarra</li>
            <li>Prahran</li>
            <li>Windsor</li>
            <li>St Kilda Road</li>
            <li>Docklands</li>
          </ul>

          <h2>Delivery Times & Fees</h2>
          <div className="info-table">
            <div className="table-row">
              <span className="table-label">Standard Delivery (within 3km)</span>
              <span className="table-value">$8.00</span>
            </div>
            <div className="table-row">
              <span className="table-label">Extended Delivery (3-5km)</span>
              <span className="table-value">$12.00</span>
            </div>
            <div className="table-row">
              <span className="table-label">Free Delivery</span>
              <span className="table-value">Orders over $150 (within 3km)</span>
            </div>
            <div className="table-row">
              <span className="table-label">Delivery Time</span>
              <span className="table-value">45-60 minutes from order confirmation</span>
            </div>
          </div>

          <h2>How to Order for Delivery</h2>
          <p>To place a delivery order, please contact us directly:</p>
          
          <div className="contact-details">
            <p>
              <strong>Phone:</strong> <a href="tel:+61400123456">(02) 1234 5678</a>
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:orders@rustyssandwiches.com.au">orders@rustyssandwiches.com.au</a>
            </p>
            <p>
              <strong>Third-Party Apps:</strong> Search "Rusty's Sandwich Parlour" on Uber Eats, DoorDash, or Menulog
            </p>
          </div>

          <h2>Important Information</h2>
          <ul className="feature-list">
            <li>
              Delivery times are estimates and may vary during peak hours or due to weather conditions.
            </li>
            <li>
              Please provide a contact phone number when placing your delivery order so our driver can reach you.
            </li>
            <li>
              Payment for delivery orders can be made by card over the phone or cash on delivery (exact change appreciated).
            </li>
            <li>
              For third-party platform orders, payment is processed through the respective app.
            </li>
          </ul>

          <p className="note">
            Questions about delivery? Give us a call and we'll be happy to help!
          </p>
        </div>
      </div>
    </div>
  );
}
