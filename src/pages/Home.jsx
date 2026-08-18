import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Fresh, Artisan<br />
            Sandwiches & Cafe
          </h1>
          <p className="hero-subtitle">
            Quality ingredients, crafted with care. Experience the perfect blend of 
            traditional recipes and modern flavours.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary btn-large">
              View Our Menu
            </Link>
            <a href="#about" className="btn btn-secondary btn-large">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="featured-section section" style={{ backgroundColor: 'var(--color-warm-white)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-heading">Customer Favourites</h2>
            <p className="section-subtitle">Discover what makes Rusty's special</p>
          </div>
          
          <div className="featured-grid">
            <FeaturedCard 
              image="https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=600&q=80"
              title="The Rusty Special"
              description="Our signature slow-roasted beef sandwich"
              price="$12.50"
            />
            <FeaturedCard 
              image="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80"
              title="Veggie Delight"
              description="Fresh, seasonal vegetarian options"
              price="$10.50"
            />
            <FeaturedCard 
              image="https://images.unsplash.com/photo-1588137372308-15f75323ca8d?w=600&q=80"
              title="Breakfast Selection"
              description="Start your day right"
              price="From $9.50"
            />
          </div>
          
          <div className="section-cta">
            <Link to="/menu" className="btn btn-primary">
              Explore Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section section">
        <div className="container about-content">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-heading">Our Story</h2>
              <p>
                Rusty's Cafe has been serving the community with delicious, handcrafted 
                sandwiches and quality coffee since 2010. What started as a small corner 
                shop has grown into a local favourite.
              </p>
              <p>
                We believe in supporting local farmers and suppliers, using seasonal 
                ingredients, and treating every customer like family. Every sandwich is 
                made fresh to order, ensuring you get the best experience every time.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1554118597-a7abc2bb3734?w=800&q=80" 
                alt="Rusty's Cafe interior"
              />
            </div>
          </div>
          
          <div className="features-grid">
            <FeatureItem 
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
              title="Quality Ingredients"
              description="Fresh, locally sourced ingredients delivered daily"
            />
            <FeatureItem 
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              title="Made to Order"
              description="Every sandwich prepared fresh when you order"
            />
            <FeatureItem 
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              title="Pay on Pickup"
              description="Order ahead and pay when you collect"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section" style={{ backgroundColor: 'var(--color-espresso)' }}>
        <div className="container cta-content">
          <h2 className="cta-title" style={{ color: 'var(--color-warm-white)' }}>
            Ready to Taste the Difference?
          </h2>
          <p className="cta-text" style={{ color: 'var(--color-beige)', opacity: 0.9 }}>
            Order your fresh sandwich today and experience what makes Rusty's special.
          </p>
          <Link to="/menu" className="btn btn-large" style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-espresso)' }}>
            Browse Our Menu
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ image, title, description, price }) {
  return (
    <div className="featured-card">
      <div className="featured-card-image">
        <img src={image} alt={title} loading="lazy" />
      </div>
      <div className="featured-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="price">{price}</span>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }) {
  return (
    <div className="feature-item">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
