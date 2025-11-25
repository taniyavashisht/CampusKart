import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthModal from "./Auth/AuthModal";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState("/");

  // ✅ Check login status & user data
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  // ✅ Run once on mount + whenever localStorage changes
  useEffect(() => {
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage")); // trigger update
    navigate("/");
  };

  const handleSellClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setRedirectAfterAuth("/create-product");
      setShowAuthModal(true);
    }
  };

  const handleNavClick = (e) => {
    const anchor = e.target.closest && e.target.closest("a");
    if (!anchor) return;
    try {
      const url = new URL(anchor.href);
      if (url.pathname === "/create-product" && !isLoggedIn) {
        e.preventDefault();
        setRedirectAfterAuth("/create-product");
        setShowAuthModal(true);
      }
    } catch {
      // ignore invalid URLs
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <Link to="/" className="logo-section">
          <img
            className="header-img"
            src="/stationary.png"
            alt="CampusKart"
          />
          <h1 className="header-text">CampusKart</h1>
        </Link>

        {/* Nav Links */}
        <nav className="nav-links" onClick={handleNavClick}>
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/products" className="nav-link">
            Browse
          </Link>

          <Link
            to="/create-product"
            className="nav-link"
            onClick={handleSellClick}
          >
            Sell
          </Link>

          {isLoggedIn && (
            <Link to="/myspace" className="nav-link">
              My Space
            </Link>
          )}
        </nav>

        {/* User Controls */}
        <div className="user-section">
          {isLoggedIn ? (
            <div className="user-menu">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">Login / Signup</button>
            </Link>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectTo={redirectAfterAuth}
        />
      )}
    </header>
  );
}
