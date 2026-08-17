import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Rusty's Sandwich Parlour</h3>
          <p>Fresh sandwiches made daily. Order online, pay in store.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav>
            <Link to="/menu">Menu</Link>
            <Link to="/catering">Catering</Link>
            <Link to="/delivery">Delivery</Link>
          </nav>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Visit us in store for pickup and payment.</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rusty's Sandwich Parlour. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
