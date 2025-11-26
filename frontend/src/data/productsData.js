import axios from "axios";

const API = axios.create({
  baseURL: "https://campuskart-7lsu.onrender.com/api",
});

/**
 * ✅ Get all products (Home + Marketplace)
 */
export const getAllProducts = async (filters = "") => {
  try {
    const res = await API.get(`/products${filters}`);
    return res.data.products;
  } catch (error) {
    console.error("❌ Error fetching products", error?.response?.data || error.message);
    return [];
  }
};

/**
 * ✅ Get products created by the logged-in user (for MySpace)
 * (uses same /products endpoint + filters in frontend)
 */
export const getMyProducts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.products;
  } catch (error) {
    console.error("❌ Error fetching my products", error?.response?.data || error.message);
    return [];
  }
};

/**
 * ✅ Create a new product (for CreateProduct page)
 */
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error creating product", error?.response?.data || error.message);
    return null;
  }
};
