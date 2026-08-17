import './Header.css';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Rusty's Sandwich Parlour</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/catering" className="nav-link">Catering</Link>
          <Link to="/delivery" className="nav-link">Delivery</Link>
        </nav>
        
        <Link to="/cart" className="cart-link">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
