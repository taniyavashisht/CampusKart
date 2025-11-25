import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"]
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },

    // ✅ FINAL CATEGORIES
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "stationery",
        "calculators",
        "lab-equipment",    // ✅ FIXED (no space)
        "textbooks"
      ]
    },

    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["new", "like-new", "good", "fair", "needs-repair"]
    },

    images: [
      {
        url: String,
        public_id: String
      }
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available"
    },

    location: {
      type: String,
      default: "Main Campus"
    },

    views: {
      type: Number,
      default: 0
    },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1 });

export default mongoose.model("Product", productSchema);
