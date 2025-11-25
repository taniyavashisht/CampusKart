import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://campuskart-7lsu.onrender.com";

export default function ProductList({ products, onDeleted }) {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="no-product">
        You haven’t listed any products yet.
      </div>
    );
  }

  // ✅ EDIT HANDLER
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_BASE}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Product deleted");

      // Remove from UI instantly
      if (onDeleted) {
        onDeleted(id);
      }

    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">

          {/* IMAGE */}
          <div className="product-image">

            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.title}
            />

            {/* CONDITION / STATUS */}
            {product.condition && (
              <span className="condition-badge">
                {product.condition}
              </span>
            )}

          </div>

          {/* INFO */}
          <div className="product-body">

            <small className="product-category">
              {product.category}
            </small>

            <h3>{product.title}</h3>

            <p className="product-desc">
              {product.description?.length > 70
                ? product.description.slice(0, 70) + "..."
                : product.description}
            </p>

            <div className="product-footer">
              <span className="price">₹ {product.price}</span>

              <span
                style={{
                  fontSize: "0.7rem",
                  color:
                    product.status === "sold"
                      ? "#ef4444"
                      : "#22c55e",
                  fontWeight: "600"
                }}
              >
                {product.status === "sold" ? "SOLD" : "AVAILABLE"}
              </span>
            </div>

            {/* ✅ ACTION BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "14px"
              }}
            >
              <button
                onClick={() => handleEdit(product._id)}
                style={{
                  background: "#0ea5e9",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDelete(product._id)}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                🗑 Delete
              </button>
            </div>

          </div>

        </div>
      ))}
    </div>
  );
}
