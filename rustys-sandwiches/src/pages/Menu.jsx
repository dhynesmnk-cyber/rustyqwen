import { Link } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import './Menu.css';

function Menu() {
  const { menuItems, categories, loading, error } = useMenu();

  if (loading) {
    return <div className="loading-page">Loading menu...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>Unable to Load Menu</h2>
        <p>{error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-container">
        <h1>Our Menu</h1>
        
        {categories.length > 0 && (
          <div className="categories-filter">
            <button className="category-btn active">All Items</button>
            {categories.map(cat => (
              <button key={cat.id} className="category-btn">
                {cat.category_data?.name}
              </button>
            ))}
          </div>
        )}

        <div className="menu-grid">
          {menuItems.map(item => (
            <Link 
              key={item.id} 
              to={`/menu/${item.item_data.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="menu-item-card"
            >
              <div className="item-info">
                <h3>{item.item_data?.name}</h3>
                {item.item_data?.description && (
                  <p className="item-desc">{item.item_data.description}</p>
                )}
                <div className="item-price">
                  {formatPrice(getLowestPrice(item.item_data?.variations))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="no-items">
            <p>No menu items available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getLowestPrice(variations) {
  if (!variations || variations.length === 0) {
    return { amount: 0 };
  }
  
  const prices = variations
    .map(v => v.item_variation_data?.price_money?.amount || 0)
    .filter(p => p > 0);
  
  if (prices.length === 0) return { amount: 0 };
  
  return { amount: Math.min(...prices) };
}

function formatPrice(money) {
  if (!money || !money.amount) return '$0.00';
  return `$${(money.amount / 100).toFixed(2)}`;
}

export default Menu;
