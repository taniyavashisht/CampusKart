import express from "express";
import { protect } from "../middleware/Auth.js";

import {
  getProducts,
  createProduct,
  toggleFavorite,
  getFavorites,
  deleteProduct,
  getSingleProduct,
  updateProduct      // ✅ ADD THIS
} from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Create new product
router.post("/", protect, createProduct);

// Add / remove favorite
router.post("/:id/favorite", protect, toggleFavorite);

// Get user's favorites
router.get("/favorites", protect, getFavorites);

// Get single product
router.get("/:id", getSingleProduct);

// ✅ UPDATE product
router.put("/:id", protect, updateProduct);

// ✅ DELETE product
router.delete("/:id", protect, deleteProduct);

export default router;
