import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCatalog, formatPrice, generateIdempotencyKey } from '../lib/square';
import { useCart } from '../hooks/useCart';
import '../styles/MenuItemDetail.css';

export default function MenuItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadItem() {
      try {
        const data = await fetchCatalog();
        const foundItem = data.objects.find(obj => obj.id === id && obj.type === 'ITEM');
        
        if (!foundItem) {
          setError('Item not found');
          return;
        }

        const itemData = {
          id: foundItem.id,
          name: foundItem.item_data.name,
          description: foundItem.item_data.description || '',
          variations: foundItem.item_data.variations || [],
          modifierLists: foundItem.item_data.modifier_list_info || [],
          available: foundItem.item_data.available !== false,
        };

        // Get all modifier details
        const allModifiers = data.objects
          .filter(obj => obj.type === 'MODIFIER')
          .reduce((acc, mod) => {
            acc[mod.id] = mod;
            return acc;
          }, {});

        itemData.allModifiers = allModifiers;
        setItem(itemData);

        // Set default variation
        if (itemData.variations.length > 0) {
          setSelectedVariation(itemData.variations[0]);
        }
      } catch (err) {
        setError('Unable to load item details');
        console.error('Error loading item:', err);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="item-detail-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-page">
        <div className="container">
          <div className="error-state">
            <h1>Item Not Found</h1>
            <p>{error || 'This item is no longer available.'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item.available) {
    return (
      <div className="item-detail-page">
        <div className="container">
          <div className="error-state">
            <h1>Unavailable</h1>
            <p>This item is currently not available.</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleModifierToggle = (modifierListId, modifierId, price) => {
    setSelectedModifiers(prev => {
      const listModifiers = prev[modifierListId] || [];
      const isSelected = listModifiers.some(m => m.id === modifierId);

      if (isSelected) {
        return {
          ...prev,
          [modifierListId]: listModifiers.filter(m => m.id !== modifierId),
        };
      } else {
        return {
          ...prev,
          [modifierListId]: [...listModifiers, { id: modifierId, price }],
        };
      }
    });
  };

  const handleAddToCart = () => {
    const modifiers = Object.values(selectedModifiers).flat();
    
    addToCart({
      id: generateIdempotencyKey(),
      itemId: item.id,
      variationId: selectedVariation?.id,
      name: item.name,
      variationName: selectedVariation?.name,
      price: (selectedVariation?.price_money?.amount || 0) / 100,
      modifiers: modifiers.map(m => ({
        id: m.id,
        name: item.allModifiers[m.id]?.modifier_data?.name || 'Modifier',
        price: (m.price || 0) / 100,
      })),
      quantity,
    });

    navigate('/cart');
  };

  const basePrice = (selectedVariation?.price_money?.amount || 0) / 100;
  const modifiersPrice = Object.values(selectedModifiers)
    .flat()
    .reduce((sum, m) => sum + (m.price || 0) / 100, 0);
  const totalPrice = (basePrice + modifiersPrice) * quantity;

  return (
    <div className="item-detail-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/menu')}>
          ← Back to Menu
        </button>

        <div className="item-detail-content">
          <div className="item-detail-header">
            <h1 className="item-title">{item.name}</h1>
            {item.description && (
              <p className="item-description">{item.description}</p>
            )}
          </div>

          {/* Variations */}
          {item.variations.length > 1 && (
            <div className="variations-section">
              <h2 className="section-title">Choose Size</h2>
              <div className="variations-grid">
                {item.variations.map((variation) => (
                  <button
                    key={variation.id}
                    className={`variation-btn ${selectedVariation?.id === variation.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVariation(variation)}
                  >
                    <span className="variation-name">{variation.name}</span>
                    {variation.price_money?.amount && (
                      <span className="variation-price">{formatPrice(variation.price_money.amount)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modifiers */}
          {item.modifierLists.length > 0 && (
            <div className="modifiers-section">
              <h2 className="section-title">Customise Your Order</h2>
              {item.modifierLists.map((modifierListInfo) => {
                // Find the full modifier list object
                const modifierList = Object.values(item.allModifiers).find(
                  m => m.modifier_list_data?.name && 
                  item.modifierLists.some(ml => ml.modifier_list_id === m.id)
                );

                if (!modifierList) return null;

                const modListData = modifierList.modifier_list_data;
                const modifiers = data?.objects
                  ?.filter(obj => obj.type === 'MODIFIER' && obj.modifier_data?.modifier_list_id === modifierList.id)
                  || [];

                return (
                  <div key={modifierListInfo.modifier_list_id} className="modifier-group">
                    <h3 className="modifier-group-title">
                      {modListData?.name || 'Options'}
                      {modifierListInfo.min_selected && ` (Min: ${modifierListInfo.min_selected})`}
                      {modifierListInfo.max_selected && modifierListInfo.max_selected !== 1 && ` (Max: ${modifierListInfo.max_selected})`}
                    </h3>
                    <div className="modifier-options">
                      {modifiers.map((mod) => (
                        <label key={mod.id} className="modifier-option">
                          <input
                            type={modifierListInfo.selection_type === 'MULTIPLE' ? 'checkbox' : 'radio'}
                            name={`modifier-${modifierListInfo.modifier_list_id}`}
                            checked={(selectedModifiers[modifierListInfo.modifier_list_id] || []).some(m => m.id === mod.id)}
                            onChange={() => handleModifierToggle(
                              modifierListInfo.modifier_list_id,
                              mod.id,
                              mod.modifier_data?.price_money?.amount || 0
                            )}
                          />
                          <span className="modifier-info">
                            <span className="modifier-name">{mod.modifier_data?.name || 'Option'}</span>
                            {mod.modifier_data?.price_money?.amount > 0 && (
                              <span className="modifier-price">+{formatPrice(mod.modifier_data.price_money.amount)}</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <label className="form-label">Quantity</label>
              <div className="quantity-controls-large">
                <button 
                  className="qty-btn-large" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-value-large">{quantity}</span>
                <button 
                  className="qty-btn-large" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price">
              <span>Total:</span>
              <span className="price-large">${totalPrice.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary btn-large add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Order - ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data for demo when Square API is not connected
const data = {
  objects: []
};
