import { Link } from 'react-router-dom';
import './Catering.css';

function Catering() {
  return (
    <div className="catering-page">
      <div className="catering-container">
        <h1>Catering Services</h1>
        
        <section className="catering-section">
          <h2>Event Catering at Rusty's</h2>
          <p>
            Planning an event? Rusty's Sandwich Parlour offers catering services for 
            corporate events, parties, and gatherings of all sizes.
          </p>
        </section>

        <section className="catering-section">
          <h2>What We Offer</h2>
          <ul className="catering-list">
            <li>Sandwich platters with a variety of fillings</li>
            <li>Fresh salads and sides</li>
            <li>Customisable menu options</li>
            <li>Delivery available for local events</li>
            <li>Setup service upon request</li>
          </ul>
        </section>

        <section className="catering-section">
          <h2>Lead Times</h2>
          <p>
            We require at least <strong>48 hours notice</strong> for catering orders. 
            For larger events (50+ people), please contact us at least one week in advance.
          </p>
        </section>

        <section className="catering-section">
          <h2>Payment & Ordering</h2>
          <p>
            Catering orders are handled separately from our online ordering system. 
            Payment can be arranged via invoice for corporate clients, or paid in-store 
            when collecting your order.
          </p>
        </section>

        <section className="catering-section">
          <h2>Contact Us</h2>
          <p>
            To discuss your catering needs or request a quote, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Phone:</strong> (02) 1234 5678</p>
            <p><strong>Email:</strong> catering@rustyssandwiches.com.au</p>
            <p><strong>Visit:</strong> Stop by our store to discuss your order in person</p>
          </div>
        </section>

        <div className="catering-cta">
          <Link to="/menu" className="btn btn-primary">View Regular Menu</Link>
        </div>
      </div>
    </div>
  );
}

export default Catering;
