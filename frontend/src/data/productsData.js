import axios from "axios";

const API = axios.create({
  baseURL: "https://campuskart-7lsu.onrender.com",
});

/**
 * Get all products from database (for Home / Marketplace)
 */
export const getAllProducts = async (filters = "") => {
  try {
    const res = await API.get(`/products${filters}`);
    return res.data.products;
  } catch (error) {
    console.error("Error fetching products", error);
    return [];
  }
};

/**
 * Get products created by the logged-in user (for MySpace)
 */
export const getMyProducts = async (token) => {
  try {
    const res = await API.get("/products/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.products;
  } catch (error) {
    console.error("Error fetching my products", error);
    return [];
  }
};

/**
 * Create a new product (for CreateProduct page)
 */
export const createProduct = async (productData, token) => {
  try {
    const res = await API.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error creating product", error);
    return null;
  }
};
