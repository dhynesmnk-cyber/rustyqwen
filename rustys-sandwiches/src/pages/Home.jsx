import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Rusty's Sandwich Parlour</h1>
          <p>Fresh, delicious sandwiches made daily with quality ingredients.</p>
          <Link to="/menu" className="btn btn-primary">Order Now</Link>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <h2>Fresh Ingredients</h2>
            <p>We use only the freshest ingredients sourced locally where possible.</p>
          </div>
          <div className="feature-card">
            <h2>Made to Order</h2>
            <p>Every sandwich is prepared fresh when you place your order.</p>
          </div>
          <div className="feature-card">
            <h2>Easy Pickup</h2>
            <p>Order online and collect from our store. Pay when you arrive.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Order?</h2>
          <p>Browse our menu and build your perfect sandwich.</p>
          <Link to="/menu" className="btn btn-secondary">View Menu</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
