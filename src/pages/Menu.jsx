import { useState } from 'react';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../hooks/useCart';
import './Menu.css';

export default function Menu() {
  const { getMenuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState('all');
  
  const menuItems = getMenuItems(activeCategory);

  return (
    <div className="menu-page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-title">Our Menu</h1>
          <p className="page-subtitle">
            Fresh, made-to-order sandwiches using quality local ingredients.
          </p>
        </header>

        {/* Category Filter */}
        <nav className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>

        {/* Menu Grid */}
        <div className="menu-grid">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <article className="menu-item-card">
      <div className="menu-item-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          aria-label={`Add ${item.name} to cart`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h2 className="menu-item-title">{item.name}</h2>
          <span className="menu-item-price">${item.price.toFixed(2)}</span>
        </div>
        <p className="menu-item-description">{item.description}</p>
        <button 
          className={`quick-add-btn ${isAdding ? 'adding' : ''}`}
          onClick={handleAddToCart}
        >
          {isAdding ? 'Added!' : 'Add to Order'}
        </button>
      </div>
    </article>
  );
}
