import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Marketplace.css";

const API_BASE = "https://campuskart-7lsu.onrender.com/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const p = res.data.product;

          setFormData({
            title: p.title,
            category: p.category,
            condition: p.condition,
            price: p.price,
            description: p.description
          });
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load product for editing");
        navigate("/myspace");
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API_BASE}/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Product updated");
      navigate("/myspace");

    } catch (err) {
      console.error(err);
      alert("Update failed");
    }

    setSaving(false);
  };

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div className="create-container">
      <form className="create-card" onSubmit={handleSubmit}>

        <h2 className="create-title">Edit Product</h2>

        <div className="create-field">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="create-field">
          <label>Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="create-field">
          <label>Condition</label>
          <input
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          />
        </div>

        <div className="create-field">
          <label>Price</label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="create-field">
          <label>Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button className="create-btn">
          {saving ? "Saving..." : "Update Product"}
        </button>

      </form>
    </div>
  );
}
