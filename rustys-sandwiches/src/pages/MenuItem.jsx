import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMenuItem } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import './MenuItem.css';

function MenuItem() {
  const { slug } = useParams();
  const { item, loading, error } = useMenuItem(slug);
  const { addToCart } = useCart();
  
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !item) {
    return (
      <div className="not-found">
        <h2>Item Not Found</h2>
        <p>Sorry, this menu item is not available.</p>
        <Link to="/menu" className="btn btn-primary">Back to Menu</Link>
      </div>
    );
  }

  const itemData = item.item_data;
  const variations = itemData.variations || [];
  const modifierLists = itemData.modifier_lists_data?.modifier_ids?.map(id => ({ id })) || [];

  const handleAddToCart = () => {
    const variation = selectedVariation || (variations.length > 0 ? variations[0] : null);
    
    if (!variation && variations.length > 0) {
      alert('Please select a variation');
      return;
    }

    const cartItem = {
      itemId: item.id,
      itemName: itemData.name,
      variationId: variation?.id,
      variationName: variation?.item_variation_data?.name,
      priceAmount: variation?.item_variation_data?.price_money?.amount || 0,
      selectedModifiers: Object.values(selectedModifiers).flat(),
      quantity,
    };

    addToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleModifierSelect = (modifierListId, modifier) => {
    setSelectedModifiers(prev => {
      const current = prev[modifierListId] || [];
      const exists = current.find(m => m.id === modifier.id);
      if (exists) {
        return { ...prev, [modifierListId]: current.filter(m => m.id !== modifier.id) };
      } else {
        return { ...prev, [modifierListId]: [...current, modifier] };
      }
    });
  };

  const isSelected = (listId, modifier) => {
    return selectedModifiers[listId]?.some(m => m.id === modifier.id);
  };

  const variation = selectedVariation || (variations.length > 0 ? variations[0] : null);
  const basePrice = variation?.item_variation_data?.price_money || { amount: 0 };

  return (
    <div className="menu-item-page">
      <div className="menu-item-container">
        <Link to="/menu" className="back-link">← Back to Menu</Link>
        
        <div className="menu-item-header">
          <h1>{itemData.name}</h1>
          {itemData.description && (
            <p className="item-description">{itemData.description}</p>
          )}
          <p className="item-price">{formatPrice(basePrice)}</p>
        </div>

        {variations.length > 1 && (
          <div className="variations-section">
            <h2>Choose Size</h2>
            <div className="variations-grid">
              {variations.map(var => (
                <button
                  key={var.id}
                  className={`variation-card ${selectedVariation?.id === var.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVariation(var)}
                >
                  <span className="variation-name">{var.item_variation_data?.name}</span>
                  <span className="variation-price">
                    {formatPrice(var.item_variation_data?.price_money)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="quantity-section">
          <label htmlFor="quantity">Quantity</label>
          <div className="quantity-controls">
            <button 
              className="qty-btn"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
            <button 
              className="qty-btn"
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          className={`btn btn-primary add-to-cart-btn ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

function formatPrice(money) {
  if (!money) return '$0.00';
  return `$${(money.amount / 100).toFixed(2)}`;
}

export default MenuItem;
