import { useState, useEffect, useCallback } from 'react'
import LoyaltySignup from './components/LoyaltySignup'
import CateringModal from './components/CateringModal'
import {
  defaultContent,
  fetchContent,
  publishContent,
  uploadImage,
  verifyPasscode
} from './lib/siteContent'
import { resizeImageFile } from './lib/imageResize'
import './index.css'

// The passcode is never in this bundle — it is held in the Netlify environment
// and checked by the functions in netlify/functions. What is kept here is the
// passcode the editor typed, in memory only, to authorise their own requests
// until the page is reloaded.

function App() {
  const [content, setContent] = useState(defaultContent)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isCateringOpen, setIsCateringOpen] = useState(false)
  const [adminData, setAdminData] = useState({ ...defaultContent })
  const [orderItems, setOrderItems] = useState([])
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false)
  const [isGateOpen, setIsGateOpen] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [gateError, setGateError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [adminPasscode, setAdminPasscode] = useState('')
  const [isCheckingPasscode, setIsCheckingPasscode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingSlot, setUploadingSlot] = useState(null)

  // Published content lives server-side; the defaults render until it arrives.
  useEffect(() => {
    let cancelled = false
    fetchContent().then((published) => {
      if (cancelled) return
      setContent(published)
      setAdminData(published)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleImageUpload = async (e, imageType, index = null) => {
    const file = e.target.files[0]
    if (!file) return

    setSaveError('')
    setUploadingSlot(imageType === 'hero' ? 'hero' : `support-${index}`)
    try {
      // Scale in the browser first, then store the file once and reference it
      // by URL, so the content record stays small for every visitor.
      const resized = await resizeImageFile(file, imageType === 'hero' ? 1800 : 1200)
      const url = await uploadImage(resized, adminPasscode)
      if (imageType === 'hero') {
        setAdminData((prev) => ({ ...prev, heroImage: url }))
      } else if (index !== null) {
        setAdminData((prev) => {
          const supportImages = [...prev.supportImages]
          supportImages[index] = url
          return { ...prev, supportImages }
        })
      }
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setUploadingSlot(null)
    }
  }

  const updateCaption = (index, value) => {
    setAdminData((prev) => {
      const supportCaptions = [...prev.supportCaptions]
      supportCaptions[index] = value
      return { ...prev, supportCaptions }
    })
  }

  const handleSaveAdmin = async () => {
    // Publish first: if the server rejects the write, the panel stays open with
    // the reason rather than reporting a save that never happened.
    setIsSaving(true)
    try {
      const published = await publishContent(adminData, adminPasscode)
      setContent(published)
      setAdminData(published)
      setSaveError('')
      setIsAdminOpen(false)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdminClick = () => {
    setAdminData(content)
    setSaveError('')
    if (isAdminUnlocked) {
      setIsAdminOpen(true)
      return
    }
    setPasscode('')
    setGateError('')
    setIsGateOpen(true)
  }

  const handlePasscodeSubmit = async (e) => {
    e.preventDefault()
    setIsCheckingPasscode(true)
    try {
      await verifyPasscode(passcode)
      setAdminPasscode(passcode)
      setIsAdminUnlocked(true)
      setIsGateOpen(false)
      setIsAdminOpen(true)
    } catch (err) {
      setGateError(err.message)
      setPasscode('')
    } finally {
      setIsCheckingPasscode(false)
    }
  }

  const closeCatering = useCallback(() => setIsCateringOpen(false), [])

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

          <div className="hero-nav-item" onClick={() => setIsCateringOpen(true)}>
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
            <figure key={index} className="support-item">
              <img src={src} alt={content.supportCaptions[index] || `Support image ${index + 1}`} className="support-image" />
              {content.supportCaptions[index] && (
                <figcaption className="support-caption">{content.supportCaptions[index]}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>

      {/* Loyalty Sign-up */}
      <LoyaltySignup />

      {/* Footer with Logo */}
      <footer className="footer">
        <img 
          src="https://1190d7984a68fba74550.cdn6.editmysite.com/uploads/b/1190d7984a68fba7455015172f28de93a092ebc7cffd9fe4d48361cca7d9268c/RUSTY%27S%20SANDWICH%20PARLOUR%20-%20Primary%20Logo-01%20%282%29_1706586218.jpg?width=2400&optimize=medium" 
          alt="Rusty's Sandwich Parlour Logo" 
          className="footer-logo"
        />
        <p className="footer-text">
          <a className="mod-link" href={`mailto:${content.preorderEmail}`}>{content.preorderEmail}</a>
        </p>
      </footer>

      {/* Catering Inquiry Modal */}
      <CateringModal isOpen={isCateringOpen} onClose={closeCatering} />

      {/* Admin Panel Button */}
      <div className="admin-panel">
        <button className="admin-toggle" onClick={handleAdminClick}>
          admin
        </button>
      </div>

      {/* Admin Passcode Gate */}
      {isGateOpen && (
        <div
          className="catering-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsGateOpen(false)
          }}
        >
          <form className="admin-gate" onSubmit={handlePasscodeSubmit}>
            <label className="admin-label" htmlFor="admin-passcode">enter passcode</label>
            <input
              id="admin-passcode"
              className="catering-input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
            {gateError && <p className="admin-gate-error" role="alert">{gateError}</p>}
            <button className="catering-submit" type="submit" disabled={isCheckingPasscode}>
              {isCheckingPasscode ? 'checking' : 'unlock'}
            </button>
          </form>
        </div>
      )}

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
            {uploadingSlot === 'hero' && <p className="admin-hint">uploading…</p>}
            {adminData.heroImage && (
              <img src={adminData.heroImage} alt="Hero preview" style={{width: '100%', height: '200px', objectFit: 'cover', marginTop: '12px'}} />
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
              {uploadingSlot === `support-${index}` && <p className="admin-hint">uploading…</p>}
              {adminData.supportImages[index] && (
                <img src={adminData.supportImages[index]} alt={`Support ${index + 1}`} style={{width: '100%', height: '150px', objectFit: 'cover', marginTop: '12px'}} />
              )}
              <label className="admin-label" style={{marginTop: '12px'}}>caption {index + 1}</label>
              <input
                type="text"
                className="admin-input"
                value={adminData.supportCaptions[index]}
                onChange={(e) => updateCaption(index, e.target.value)}
              />
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

        {saveError && <p className="admin-save-error" role="alert">{saveError}</p>}

        <button className="admin-save" onClick={handleSaveAdmin} disabled={isSaving}>
          {isSaving ? 'publishing…' : 'publish changes'}
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
