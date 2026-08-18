import { useState, useEffect } from 'react'
import './index.css'

// Default content - can be updated via admin panel
const defaultContent = {
  title: "rusty's sandwich parlour",
  tagline: "where every bite tells a story of craftsmanship and care",
  preorderEmail: "orders@rustyssandwichparlour.com",
  galleryImages: [
    'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=800&q=80',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    'https://images.unsplash.com/photo-1509721437493-41fa6e2fb819?w=800&q=80'
  ]
}

function App() {
  const [content, setContent] = useState(defaultContent)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [adminData, setAdminData] = useState({ ...defaultContent })

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

  const handleSaveAdmin = () => {
    setContent(adminData)
    localStorage.setItem('rustys-content', JSON.stringify(adminData))
    setIsAdminOpen(false)
  }

  const handlePreorderClick = () => {
    setIsEmailModalOpen(true)
  }

  const generateEmailBody = () => {
    return `Subject: Pre-Order Request

Dear Rusty's Team,

I would like to place a pre-order for pickup.

Please contact me to confirm availability and timing.

Best regards,
[Your Name]
[Your Phone Number]`
  }

  const mailtoLink = `mailto:${content.preorderEmail}?subject=Pre-Order Request&body=${encodeURIComponent(generateEmailBody())}`

  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-links">
          <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>home</button>
          <button className="nav-link" onClick={() => document.querySelector('.gallery')?.scrollIntoView({ behavior: 'smooth' })}>gallery</button>
        </div>
      </nav>

      {/* Hero Section with Typewriter Animation */}
      <section className="hero">
        <div className="typewriter-container">
          <div className="typewriter-title">{content.title}</div>
        </div>
        <p className="tagline">{content.tagline}</p>
      </section>

      {/* Hero Navigation Links */}
      <section className="hero-nav">
        <div className="hero-nav-item" onClick={handlePreorderClick}>
          <span className="hero-nav-number">01</span>
          <span className="hero-nav-text">preorder</span>
        </div>
        <p className="hero-nav-subtitle">send us an email order</p>

        <div className="hero-nav-item" onClick={() => document.querySelector('.gallery')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="hero-nav-number">02</span>
          <span className="hero-nav-text">catering</span>
        </div>
        <p className="hero-nav-subtitle">coz you got friends</p>

        <div className="hero-nav-item">
          <span className="hero-nav-number">03</span>
          <span className="hero-nav-text">specials</span>
        </div>
        <p className="hero-nav-subtitle">no, you are!</p>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <div className="gallery-grid">
          {content.galleryImages.map((src, index) => (
            <div key={index} className="gallery-item">
              <img src={src} alt={`Gallery image ${index + 1}`} className="gallery-image" />
            </div>
          ))}
        </div>
      </section>

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
          <span className="admin-title">update content</span>
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
        </div>

        <div className="admin-section">
          <h3 className="admin-section-title">gallery images</h3>
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="admin-form-group">
              <label className="admin-label">image {index + 1} url</label>
              <input 
                type="text" 
                className="admin-input"
                value={adminData.galleryImages[index] || ''}
                onChange={(e) => {
                  const newImages = [...adminData.galleryImages]
                  newImages[index] = e.target.value
                  setAdminData({...adminData, galleryImages: newImages})
                }}
              />
            </div>
          ))}
        </div>

        <button className="admin-save" onClick={handleSaveAdmin}>
          save changes
        </button>
      </div>

      {/* Email Order Modal */}
      <div className={`email-modal ${isEmailModalOpen ? 'active' : ''}`}>
        <div className="email-content">
          <button 
            className="admin-close" 
            style={{position: 'absolute', top: '40px', right: '40px'}}
            onClick={() => setIsEmailModalOpen(false)}
          >
            ×
          </button>
          <h2 className="email-title">Pre-Order via Email</h2>
          <p className="email-body">{generateEmailBody()}</p>
          <a href={mailtoLink} className="email-link">
            open email client
          </a>
        </div>
      </div>
    </>
  )
}

export default App
