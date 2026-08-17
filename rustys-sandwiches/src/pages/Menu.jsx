import { useState, useEffect } from 'react';
import { fetchCatalog, formatPrice } from '../lib/square';
import '../styles/Menu.css';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await fetchCatalog();
        
        // Filter and organize catalog objects
        const items = data.objects
          .filter(obj => obj.type === 'ITEM')
          .map(item => ({
            id: item.id,
            name: item.item_data.name,
            description: item.item_data.description || '',
            variations: item.item_data.variations || [],
            modifierLists: item.item_data.modifier_list_info || [],
            available: item.item_data.available || true,
          }));
        
        setMenuItems(items);
      } catch (err) {
        setError('Unable to load menu. Please try again later.');
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  if (loading) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading our delicious menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="error-state">
            <h1>Menu</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="container">
        <header className="page-header">
          <h1 className="section-heading">Our Menu</h1>
          <p className="page-subtitle">Fresh, made-to-order sandwiches using quality local ingredients.</p>
        </header>

        {menuItems.length === 0 ? (
          <div className="empty-menu">
            <p>Menu items will appear here once connected to Square.</p>
            <p className="demo-note">For demo purposes, check back when Square API is configured.</p>
          </div>
        ) : (
          <div className="menu-grid">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({ item }) {
  const baseVariation = item.variations[0];
  const basePrice = baseVariation?.price_money?.amount || 0;

  return (
    <a href={`/menu/${item.id}`} className="menu-item-card card">
      <div className="menu-item-content">
        <h2 className="menu-item-title">{item.name}</h2>
        {item.description && (
          <p className="menu-item-description">{item.description}</p>
        )}
        <div className="menu-item-footer">
          {basePrice > 0 && (
            <span className="price">{formatPrice(basePrice)}</span>
          )}
          <span className="view-details">View details →</span>
        </div>
      </div>
    </a>
  );
}
