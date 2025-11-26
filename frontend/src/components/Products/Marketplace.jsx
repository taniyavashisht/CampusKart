import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ChatPopup from "../Chat";
import "./Marketplace.css";

const API_BASE = "https://campuskart-7lsu.onrender.com/api";

const categories = [
  { label: "All", value: "" },
  { label: "Stationery", value: "stationery" },
  { label: "Calculators", value: "calculators" },
  { label: "Lab Equipment", value: "lab-equipment" },
  { label: "Textbooks", value: "textbooks" }
];

export default function Marketplace() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ✅ Chat popup state
  const [activeChat, setActiveChat] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`, {
        params: {
          search,
          category: selectedCategory
        }
      });

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedCategory("");
    fetchProducts();
  };

  // ✅ REPLACED NAVIGATION WITH POPUP CHAT
  const handleChat = (product) => {
    const token = localStorage.getItem("token");
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !loggedUser) {
      alert("You must be logged in to chat with seller");
      return;
    }

    const productId = product._id;
    const sellerId =
      typeof product.seller === "object"
        ? product.seller._id
        : product.seller;

    if (!productId || !sellerId) {
      alert("Chat error. Seller not found.");
      return;
    }

    // Prevent self chat
    if (loggedUser.id === sellerId) {
      alert("You cannot chat with yourself.");
      return;
    }

    // ✅ THIS OPENS SAME POPUP AS MYSPACE
    setActiveChat({
      productId,
      otherUserId: sellerId
    });
  };

  return (
    <div className="marketplace-container">

      <div className="marketplace-hero">
        <h1>Browse Marketplace</h1>
        <p>Discover amazing deals from fellow students</p>
      </div>

      <div className="marketplace-layout">

        {/* -------- LEFT SIDEBAR -------- */}
        <aside className="marketplace-sidebar">
          <h3>Search & Filter</h3>

          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit" className="search-btn">
              Search
            </button>

            <button type="button" className="clear-btn" onClick={clearSearch}>
              Clear
            </button>
          </form>

          <h4>Categories</h4>

          <div className="category-list">
            {categories.map((cat) => (
              <label key={cat.value} className="category-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.value}
                  onChange={() => setSelectedCategory(cat.value)}
                />
                {cat.label}
              </label>
            ))}
          </div>
        </aside>

        {/* -------- PRODUCTS -------- */}
        <main className="marketplace-main">

          <div className="marketplace-header">
            <h2>Available Items</h2>
            <span>Showing {products.length} items</span>
          </div>

          {products.length === 0 ? (
            <p className="no-product">No products found</p>
          ) : (
            <div className="products-grid">

              {products.map((product) => (
                <div key={product._id} className="product-card">

                  <div className="product-image">
                    <img
                      src={product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.title}
                    />

                    <div className="condition-badge">
                      {product.condition}
                    </div>
                  </div>

                  <div className="product-body">

                    <small className="product-category">
                      {product.category}
                    </small>

                    <h3>{product.title}</h3>

                    <p className="product-desc">
                      {product.description}
                    </p>

                    <div className="product-footer">
                      <span className="price">₹{product.price}</span>

                      {/* ✅ FIXED BUTTON */}
                      <button
                        className="chat-btn"
                        onClick={() => handleChat(product)}
                      >
                        💬 Start Chat
                      </button>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </main>
      </div>

      {/* ✅ CHAT POPUP (SAME AS MYSPACE) */}
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
