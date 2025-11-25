import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useMemo, useEffect } from "react";
import AuthModal from "./Auth/AuthModal";
import { AuthContext } from "../context/AuthContext";
import { getAllProducts } from "../data/productsData";
import ChatPopup from "./Chat";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [products, setProducts] = useState([]);

  // ✅ Chat popup state
  const [activeChat, setActiveChat] = useState(null);

  // ✅ FETCH REAL PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProducts();
      setProducts(data || []);
    };

    loadProducts();
  }, []);

  const categoryNames = [
    "Textbooks",
    "Stationery",
    "Calculators",
    "Lab Equipment"
  ];

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];

    const productTitles = products.map((p) => p.title).filter(Boolean);
    const combined = [...new Set([...categoryNames, ...productTitles])];

    return combined
      .filter((item) => item.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery, products]);

  // ✅ SHOW ONLY LATEST 4 PRODUCTS
  const featuredProducts = [...products].reverse().slice(0, 3);

  const categories = [
    {
      name: "Textbooks",
      value: "textbooks",
      icon: "📚",
      count: products.filter((p) => p.category === "textbooks").length
    },
    {
      name: "Stationery",
      value: "stationery",
      icon: "✏️",
      count: products.filter((p) => p.category === "stationery").length
    },
    {
      name: "Calculators",
      value: "calculators",
      icon: "🧮",
      count: products.filter((p) => p.category === "calculators").length
    },
    {
      name: "Lab Equipment",
      value: "lab-equipment",
      icon: "🔬",
      count: products.filter((p) => p.category === "lab-equipment").length
    }
  ];

  const handleChatClick = (product) => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (!token || !userData) {
      setIsAuthModalOpen(true);
      return;
    }

    const productId = product._id;
    const sellerId =
      typeof product.seller === "object"
        ? product.seller?._id
        : product.seller;

    if (!productId || !sellerId) {
      console.error("Missing product or seller:", product);
      return;
    }

    if (userData.id === sellerId) {
      alert("You cannot chat with yourself.");
      return;
    }

    setActiveChat({
      productId,
      otherUserId: sellerId
    });
  };

  return (
    <div className="home-container">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* ============== HERO SECTION ============== */}
      <section className="hero-section">
        <div className="container text-center">
          <h1 className="hero-title">Your Campus Marketplace</h1>
          <p className="hero-subtitle">
            Buy & sell textbooks, stationery, calculators & lab equipment
          </p>

          <div
            className="search-container"
            style={{
              position: "relative",
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            <div
              className="search-box"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#0f172a",
                padding: "8px",
                borderRadius: "14px",
                border: "1px solid #1e293b",
                gap: "6px"
              }}
            >
              <span style={{ color: "#94a3b8", padding: "0 6px" }}>🔍</span>

              <input
                type="text"
                placeholder="Search for textbooks, stationery, calculators..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = searchQuery.trim();
                    if (q.length > 0)
                      navigate(`/products?q=${encodeURIComponent(q)}`);
                    setShowSuggestions(false);
                  }
                }}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "0.95rem",
                  padding: "6px"
                }}
              />

              <button
                onClick={() => {
                  const q = searchQuery.trim();
                  if (q.length > 0)
                    navigate(`/products?q=${encodeURIComponent(q)}`);
                  setShowSuggestions(false);
                }}
                style={{
                  background: "#0ea5e9",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Search
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div
                className="search-suggestions"
                style={{
                  position: "absolute",
                  width: "100%",
                  background: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "10px",
                  marginTop: "6px",
                  zIndex: 20,
                  overflow: "hidden"
                }}
              >
                {suggestions.map((s, i) => (
                  <div
                    key={`${s}-${i}`}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #1e293b"
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();

                      const sLower = s.toLowerCase();

                      if (sLower.includes("textbook")) {
                        navigate(`/products?category=textbooks`);
                      } else if (sLower.includes("stationery")) {
                        navigate(`/products?category=stationery`);
                      } else if (sLower.includes("calculator")) {
                        navigate(`/products?category=calculators`);
                      } else if (sLower.includes("lab")) {
                        navigate(`/products?category=lab-equipment`);
                      } else {
                        navigate(`/products?q=${encodeURIComponent(s)}`);
                      }

                      setSearchQuery(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============== CATEGORIES ============== */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>

          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-card"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/products?category=${category.value}`)
                }
              >
                <div className="category-icon">
                  {category.icon}
                </div>
                <h4>{category.name}</h4>
                <span>{category.count} items</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== LISTINGS ============== */}
      <section className="listings-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recent Listings</h2>
            <Link to="/products" className="view-all-btn">
              View All →
            </Link>
          </div>

          <div className="listings-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="listing-card">
                <div className="listing-image">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={product.title}
                  />
                  <span className="condition-badge">
                    {product.condition}
                  </span>
                </div>

                <div className="listing-content">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>

                  <div className="listing-meta">
                    <span className="listing-price">
                      ₹{product.price}
                    </span>

                    <span className="listing-location">
                      {product.location || "Campus"}
                    </span>
                  </div>

                  <button
                    className="start-chat-btn"
                    onClick={() => handleChatClick(product)}
                  >
                    💬 Start Chat
                  </button>
                </div>
              </div>
            ))}

            {featuredProducts.length === 0 && (
              <p style={{ color: "white", textAlign: "center" }}>
                No products available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {activeChat && (
        <ChatPopup
          productId={activeChat.productId}
          otherUserId={activeChat.otherUserId}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}
