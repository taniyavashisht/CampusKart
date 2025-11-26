import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Marketplace.css"; // IMPORTANT

const API_BASE = "https://campuskart-7lsu.onrender.com/api";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    price: "",
    description: ""
  });

  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { label: "Stationery", value: "stationery" },
    { label: "Calculators", value: "calculators" },
    { label: "Lab Equipment", value: "lab-equipment" },
    { label: "Textbooks", value: "textbooks" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 photos allowed");
      return;
    }

    setPhotos(files);
    setPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      const imageBase64Array = await Promise.all(
        photos.map(
          file =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );

      const payload = {
        title: formData.title,
        category: formData.category,
        condition: formData.condition,
        price: Number(formData.price),
        description: formData.description,
        images: imageBase64Array.map(img => ({ url: img }))
      };

      await axios.post(`${API_BASE}/products`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Product Listed");
      navigate("/products");

    } catch (err) {
      console.error(err);
      alert("Error creating product");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="create-container">
      <form className="create-card" onSubmit={handleSubmit}>

        <h2 className="create-title">List Your Item</h2>

        <div className="create-field">
          <label>Item Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>

        <div className="create-field">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="create-field">
          <label>Condition *</label>
          <select
  name="condition"
  value={formData.condition}
  onChange={handleInputChange}
>
  <option value="">Select</option>
  <option value="new">New</option>
  <option value="like-new">Like New</option>
  <option value="good">Good</option>
  <option value="fair">Fair</option>
  <option value="needs-repair">Needs Repair</option>
</select>

        </div>

        <div className="create-field">
          <label>Price (₹) *</label>
         <input
  type="text"
  name="price"
  pattern="[0-9]*"

            value={formData.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="create-field">
          <label>Description *</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="create-field">

  <label>Upload Photos *</label>

  <div className="upload-box">
    <input
      id="fileUpload"
      type="file"
      accept="image/*"
      multiple
      onChange={handlePhotoUpload}
      hidden
    />

    <label htmlFor="fileUpload" className="upload-label">
      Click to uplaod photos
      <span>Max 5 images</span>
    </label>
  </div>

</div>


        {preview.length > 0 && (
          <div className="preview-grid">
            {preview.map((src, i) => (
              <img key={i} src={src} className="preview-img" />
            ))}
          </div>
        )}

        <button className="create-btn">
          {isSubmitting ? "Listing..." : "List Item"}
        </button>

      </form>
    </div>
  );
}
