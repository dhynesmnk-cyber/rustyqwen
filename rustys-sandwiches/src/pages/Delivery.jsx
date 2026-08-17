import { Link } from 'react-router-dom';
import './Delivery.css';

function Delivery() {
  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <h1>Delivery Information</h1>
        
        <section className="delivery-section">
          <h2>Current Service Model</h2>
          <p>
            At this time, Rusty's Sandwich Parlour operates on a <strong>pickup-only basis</strong> 
            through our online ordering system. Orders are placed online and collected from our store.
          </p>
        </section>

        <section className="delivery-section">
          <h2>Alternative Options</h2>
          <p>
            While we don't currently offer direct delivery through our website, you have a few options:
          </p>
          <ul className="delivery-list">
            <li><strong>Pickup:</strong> Order online and collect from our store at your convenience.</li>
            <li><strong>Third-party delivery:</strong> We may be available on local delivery platforms. Check your preferred app for availability.</li>
            <li><strong>Catering delivery:</strong> For large catering orders, delivery may be arranged. See our <Link to="/catering">Catering page</Link> for details.</li>
          </ul>
        </section>

        <section className="delivery-section">
          <h2>Pickup Process</h2>
          <ol className="delivery-steps">
            <li>Browse our menu and place your order online</li>
            <li>Select your preferred pickup time</li>
            <li>Arrive at our store at the scheduled time</li>
            <li>Pay for your order at the counter</li>
            <li>Enjoy your fresh sandwich!</li>
          </ol>
        </section>

        <section className="delivery-section">
          <h2>Location & Hours</h2>
          <div className="location-info">
            <p><strong>Address:</strong> 123 Main Street, Your Suburb VIC 3000</p>
            <p><strong>Hours:</strong> Monday - Friday: 9am - 5pm</p>
            <p><strong>Phone:</strong> (02) 1234 5678</p>
          </div>
        </section>

        <div className="delivery-cta">
          <Link to="/menu" className="btn btn-primary">Order for Pickup</Link>
        </div>
      </div>
    </div>
  );
}

export default Delivery;
