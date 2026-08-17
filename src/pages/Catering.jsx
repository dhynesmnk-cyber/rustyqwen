import '../styles/StaticPages.css';

export default function Catering() {
  return (
    <div className="static-page">
      <div className="container">
        <header className="page-header">
          <h1 className="section-heading">Catering Services</h1>
        </header>

        <div className="static-content card">
          <p className="intro-text">
            Rusty's Sandwich Parlour offers delicious catering for your events, meetings, and gatherings. 
            From corporate lunches to birthday parties, we've got you covered with fresh, made-to-order sandwiches.
          </p>

          <h2>Catering Options</h2>
          <ul className="feature-list">
            <li>
              <strong>Sandwich Platters:</strong> Assorted gourmet sandwiches cut into bite-sized pieces, 
              perfect for sharing. Choose from our most popular varieties or create a custom selection.
            </li>
            <li>
              <strong>Boxed Lunches:</strong> Individual boxes containing a full sandwich, sides, and a treat. 
              Ideal for meetings and conferences.
            </li>
            <li>
              <strong>Custom Orders:</strong> Have specific dietary requirements? We can accommodate vegetarian, 
              vegan, gluten-free, and other special requests with advance notice.
            </li>
          </ul>

          <h2>Ordering Information</h2>
          <div className="info-box">
            <p><strong>Lead Time:</strong> Please place catering orders at least 48 hours in advance. 
            For large orders (20+ people), we recommend 3-5 days notice.</p>
            
            <p><strong>Payment:</strong> Catering orders are paid separately from our online ordering system. 
            Payment can be made by cash, card, or invoice (for approved corporate accounts) upon pickup or delivery.</p>
            
            <p><strong>Pickup & Delivery:</strong> Catering orders can be picked up from our venue during 
            business hours. Delivery may be available for large orders within certain areas – enquire when placing your order.</p>
          </div>

          <h2>How to Order</h2>
          <p>Contact us directly to discuss your catering needs:</p>
          
          <div className="contact-details">
            <p>
              <strong>Phone:</strong> <a href="tel:+61400123456">(02) 1234 5678</a>
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:catering@rustyssandwiches.com.au">catering@rustyssandwiches.com.au</a>
            </p>
            <p>
              <strong>Visit Us:</strong><br />
              Rusty's Sandwich Parlour<br />
              123 Main Street<br />
              Melbourne VIC 3000
            </p>
          </div>

          <p className="note">
            We look forward to helping make your event delicious!
          </p>
        </div>
      </div>
    </div>
  );
}
