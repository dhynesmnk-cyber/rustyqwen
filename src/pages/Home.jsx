import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">
            Fresh Sandwiches,<br />
            Made Just for You
          </h1>
          <p className="hero-subtitle">
            Quality local ingredients, crafted with care. Order online and pick up at your convenience.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-strong btn-large">
              Order Now
            </Link>
            <a href="#about" className="btn btn-secondary btn-large">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section" style={{ backgroundColor: 'var(--colour-section-background)' }}>
        <div className="container">
          <h2 className="section-heading text-center">Why Choose Rusty's?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>Quality Ingredients</h3>
              <p>Fresh, locally sourced ingredients delivered daily. We partner with local suppliers to bring you the best.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Made to Order</h3>
              <p>Every sandwich is prepared fresh when you order. No pre-made sandwiches sitting under heat lamps.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Pay in Store</h3>
              <p>No online payment needed. Order ahead and pay when you collect. Simple, secure, and convenient.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section section">
        <div className="container about-content">
          <h2 className="section-heading">About Rusty's</h2>
          <p className="about-text">
            Rusty's Sandwich Parlour has been serving the Melbourne community with delicious, 
            handcrafted sandwiches since 2010. What started as a small corner shop has grown into 
            a local favourite, but our commitment to quality and service remains unchanged.
          </p>
          <p className="about-text">
            We believe in supporting local farmers and suppliers, using seasonal ingredients, 
            and treating every customer like family. Whether you're after a quick lunch or 
            catering for your next event, we've got you covered.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">13+</span>
              <span className="stat-label">Years of Service</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Menu Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000s</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section" style={{ backgroundColor: 'var(--colour-action-strong)' }}>
        <div className="container cta-content">
          <h2 className="cta-title" style={{ color: 'var(--colour-text-inverse)' }}>
            Ready to Taste the Difference?
          </h2>
          <p className="cta-text" style={{ color: 'var(--colour-text-inverse)', opacity: 0.9 }}>
            Order your fresh sandwich today and experience what makes Rusty's special.
          </p>
          <Link to="/menu" className="btn btn-large" style={{ backgroundColor: 'var(--colour-page-background)', color: 'var(--colour-text-primary)' }}>
            Browse Our Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
