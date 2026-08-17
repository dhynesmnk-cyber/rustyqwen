import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import '../styles/Header.css';

export default function Header() {
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Rusty's</span>
          <span className="logo-tagline">Sandwich Parlour</span>
        </Link>

        <nav className="nav">
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/catering" className="nav-link">Catering</Link>
          <Link to="/delivery" className="nav-link">Delivery</Link>
        </nav>

        <button 
          className="cart-button btn btn-primary"
          onClick={() => setIsCartOpen(true)}
          aria-label={`View cart with ${cartCount} items`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
