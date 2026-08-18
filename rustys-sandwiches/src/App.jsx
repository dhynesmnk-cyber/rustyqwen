import { useState, useEffect } from 'react'
import './index.css'

// Default content - can be updated via admin panel
const defaultContent = {
  title: "rusty's sandwich parlour",
  tagline: "where every bite tells a story of craftsmanship and care",
  preorderEmail: "orders@rustyssandwichparlour.com",
  heroImage: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=1600&q=80',
  supportImages: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    'https://images.unsplash.com/photo-1509721437493-41fa6e2fb819?w=800&q=80',
    'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&q=80'
  ],
  menuItems: [
    { id: 1, name: 'The Rusty Classic', description: 'Roast beef, aged cheddar, horseradish cream', price: 14 },
    { id: 2, name: 'Turkey Club Deluxe', description: 'Smoked turkey, bacon, avocado, lettuce, tomato', price: 13 },
    { id: 3, name: 'Italian Stallion', description: 'Salami, capicola, provolone, giardiniera, hot peppers', price: 15 },
    { id: 4, name: 'Veggie Supreme', description: 'Hummus, roasted vegetables, sprouts, swiss cheese', price: 12 },
    { id: 5, name: 'BBQ Pulled Pork', description: 'Slow-cooked pork, coleslaw, pickles, BBQ sauce', price: 14 },
    { id: 6, name: 'Grilled Cheese Melt', description: 'Three cheese blend, caramelized onions, sourdough', price: 11 }
  ]
}

function App() {
  const [content, setContent] = useState(defaultContent)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [adminData, setAdminData] = useState({ ...defaultContent })
  const [orderItems, setOrderItems] = useState([])
  
  // Load saved content from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rustys-content')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setContent(parsed)
        setAdminData(parsed)
      } catch (e) {
        console.error('Failed to load saved content')
      }
    }
  }, [])

  const handleImageUpload = (e, imageType, index = null) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        if (imageType === 'hero') {
          setAdminData({...adminData, heroImage: base64String})
        } else if (imageType === 'support' && index !== null) {
          const newImages = [...adminData.supportImages]
          newImages[index] = base64String
          setAdminData({...adminData, supportImages: newImages})
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAdmin = () => {
    setContent(adminData)
    localStorage.setItem('rustys-content', JSON.stringify(adminData))
    setIsAdminOpen(false)
  }

  const handlePreorderClick = () => {
    setOrderItems([])
    setIsOrderModalOpen(true)
  }

  const toggleOrderItem = (item) => {
    setOrderItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev.filter(i => i.id !== item.id)
      }
      return [...prev, item]
    })
  }

  const generateEmailBody = () => {
    if (orderItems.length === 0) {
      return `Subject: Pre-Order Request\n\nDear Rusty's Team,\n\nI would like to place a pre-order for pickup.\n\nPlease contact me to confirm availability and timing.\n\nBest regards,\n[Your Name]\n[Your Phone Number]`
    }
    
    const itemsList = orderItems.map(item => `- ${item.name} - $${item.price}`).join('\n')
    const total = orderItems.reduce((sum, item) => sum + item.price, 0)
    
    return `Subject: Pre-Order Request\n\nDear Rusty's Team,\n\nI would like to place a pre-order for pickup:\n\n${itemsList}\n\nTotal: $${total}\n\nPlease contact me to confirm availability and timing.\n\nBest regards,\n[Your Name]\n[Your Phone Number]`
  }

  const mailtoLink = `mailto:${content.preorderEmail}?subject=Pre-Order Request&body=${encodeURIComponent(generateEmailBody())}`

  return (
    <>
      {/* Hero Section with Image */}
      <section className="hero">
        <div className="typewriter-title">{content.title}</div>
        <p className="tagline">{content.tagline}</p>
        
        <div className="hero-image-container">
          <img src={content.heroImage} alt="Rusty's Sandwich Parlour" className="hero-image" />
        </div>

        <nav className="hero-nav">
          <div className="hero-nav-item" onClick={handlePreorderClick}>
            <span className="hero-nav-number">01</span>
            <span className="hero-nav-text">preorder</span>
          </div>
          <p className="hero-nav-subtitle">send us an email order</p>

          <div className="hero-nav-item">
            <span className="hero-nav-number">02</span>
            <span className="hero-nav-text">catering</span>
          </div>
          <p className="hero-nav-subtitle">coz you got friends</p>

          <div className="hero-nav-item">
            <span className="hero-nav-number">03</span>
            <span className="hero-nav-text">specials</span>
          </div>
          <p className="hero-nav-subtitle">no, you are!</p>
        </nav>
      </section>

      {/* Support Gallery Section */}
      <section className="support-gallery">
        <div className="support-grid">
          {content.supportImages.map((src, index) => (
            <div key={index} className="support-item">
              <img src={src} alt={`Support image ${index + 1}`} className="support-image" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer with Logo */}
      <footer className="footer">
        <img 
          src="https://1190d7984a68fba74550.cdn6.editmysite.com/uploads/b/1190d7984a68fba7455015172f28de93a092ebc7cffd9fe4d48361cca7d9268c/RUSTY%27S%20SANDWICH%20PARLOUR%20-%20Primary%20Logo-01%20%282%29_1706586218.jpg?width=2400&optimize=medium" 
          alt="Rusty's Sandwich Parlour Logo" 
          className="footer-logo"
        />
        <p className="footer-text">{content.preorderEmail}</p>
      </footer>

      {/* Admin Panel Button */}
      <div className="admin-panel">
        <button 
          className="admin-toggle"
          onClick={() => {
            setAdminData(content)
            setIsAdminOpen(true)
          }}
        >
          admin
        </button>
      </div>

      {/* Admin Modal */}
      <div className={`admin-modal ${isAdminOpen ? 'active' : ''}`}>
        <div className="admin-header">
          <span className="admin-title">site settings</span>
          <button className="admin-close" onClick={() => setIsAdminOpen(false)}>×</button>
        </div>

        <div className="admin-section">
          <h3 className="admin-section-title">main content</h3>
          
          <div className="admin-form-group">
            <label className="admin-label">title text</label>
            <input 
              type="text" 
              className="admin-input"
              value={adminData.title}
              onChange={(e) => setAdminData({...adminData, title: e.target.value})}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">tagline</label>
            <textarea 
              className="admin-textarea"
              value={adminData.tagline}
              onChange={(e) => setAdminData({...adminData, tagline: e.target.value})}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">preorder email</label>
            <input 
              type="email" 
              className="admin-input"
              value={adminData.preorderEmail}
              onChange={(e) => setAdminData({...adminData, preorderEmail: e.target.value})}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">hero image</label>
            <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero')}
                style={{flex: 1}}
              />
            </div>
            {adminData.heroImage && (
              <img src={adminData.heroImage} alt="Hero preview" style={{width: '100%', height: '200px', objectFit: 'cover', marginTop: '12px', borderRadius: '4px'}} />
            )}
          </div>
        </div>

        <div className="admin-section">
          <h3 className="admin-section-title">support gallery images</h3>
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="admin-form-group">
              <label className="admin-label">image {index + 1}</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'support', index)}
              />
              {adminData.supportImages[index] && (
                <img src={adminData.supportImages[index]} alt={`Support ${index + 1}`} style={{width: '100%', height: '150px', objectFit: 'cover', marginTop: '12px', borderRadius: '4px'}} />
              )}
            </div>
          ))}
        </div>

        <div className="admin-section">
          <h3 className="admin-section-title">menu items</h3>
          
          {adminData.menuItems.map((item, index) => (
            <div key={item.id} className="admin-menu-item">
              <div className="admin-form-group">
                <label className="admin-label">item {index + 1} name</label>
                <input 
                  type="text" 
                  className="admin-input"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...adminData.menuItems]
                    newItems[index].name = e.target.value
                    setAdminData({...adminData, menuItems: newItems})
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">description</label>
                <textarea 
                  className="admin-textarea"
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...adminData.menuItems]
                    newItems[index].description = e.target.value
                    setAdminData({...adminData, menuItems: newItems})
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">price</label>
                <input 
                  type="number" 
                  className="admin-input"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...adminData.menuItems]
                    newItems[index].price = parseInt(e.target.value) || 0
                    setAdminData({...adminData, menuItems: newItems})
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="admin-save" onClick={handleSaveAdmin}>
          save changes
        </button>
      </div>

      {/* Order Modal */}
      <div className={`order-modal ${isOrderModalOpen ? 'active' : ''}`}>
        <div className="order-content">
          <button 
            className="admin-close" 
            style={{position: 'absolute', top: '1rem', right: '1rem'}}
            onClick={() => setIsOrderModalOpen(false)}
          >
            ×
          </button>
          <h2 className="order-title">build your order</h2>
          <p className="order-subtitle">click items to add them to your email</p>
          
          <div className="order-items-list">
            {content.menuItems.map((item) => {
              const isSelected = orderItems.find(i => i.id === item.id)
              return (
                <div 
                  key={item.id} 
                  className="order-selected-item"
                  onClick={() => toggleOrderItem(item)}
                  style={{cursor: 'pointer'}}
                >
                  <span className="order-item-name">{item.name} - ${item.price}</span>
                  <span className="order-item-price">{isSelected ? '✓' : '+'}</span>
                </div>
              )
            })}
          </div>
          
          {orderItems.length > 0 && (
            <div className="order-total">
              <span>total:</span>
              <span>${orderItems.reduce((sum, item) => sum + item.price, 0)}</span>
            </div>
          )}
          
          <a href={mailtoLink} className="order-link">
            send order via email →
          </a>
        </div>
      </div>
    </>
  )
}

export default App
