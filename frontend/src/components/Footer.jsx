export default function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="container">
          <div className="footer-content">

            {/* BRAND */}
            <div className="footer-brand">
              <h3>CampusKart</h3>
              <p>
                A trusted marketplace for students to buy and sell
                academic essentials on campus.
              </p>
            </div>

            {/* LINKS */}
            <div className="footer-links">

              {/* QUICK LINKS */}
              <div className="footer-column">
                <h4>Explore</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/products">Browse</a></li>
                  <li><a href="/create-product">Sell</a></li>
                  <li><a href="/myspace">My Space</a></li>
                </ul>
              </div>

              {/* CATEGORIES */}
              <div className="footer-column">
                <h4>Categories</h4>
                <ul>
                  <li><a href="/products?category=textbooks">Textbooks</a></li>
                  <li><a href="/products?category=stationery">Stationery</a></li>
                  <li><a href="/products?category=calculators">Calculators</a></li>
                  <li><a href="/products?category=lab-equipment">Lab Equipment</a></li>
                </ul>
              </div>

              {/* CONTACT */}
              <div className="footer-column">
                <h4>Contact</h4>
                <ul>
                  <li>
                    <a href="mailto:support@campuskart.com">
                      support@campuskart.com
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* FOOTER BOTTOM */}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CampusKart — Built for students</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
