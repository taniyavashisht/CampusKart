import axios from "axios";

const api = axios.create({
  // ✅ MUST include /api
  baseURL: "https://campuskart-7lsu.onrender.com/api",
  withCredentials: true,
});

/* =========================
   TOKEN INTERCEPTOR
========================= */
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    (JSON.parse(localStorage.getItem("user") || "{}")).token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   RESPONSE LOGGER
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* =========================
   AUTH API
========================= */

export const authAPI = {
  login: (data) => api.post("/auth/login", data),

  // ✅ use /signup – matches typical backend route
  signup: (data) => api.post("/auth/signup", data),

  sendOtp: (data) => api.post("/auth/send-otp", data),

  verifyOtp: (data) => api.post("/auth/verify-otp", data),

  forgotPassword: (data) => api.post("/auth/forgot-password", data),

  resetPassword: (data) => api.post("/auth/reset-password", data),

  me: () => api.get("/auth/me"),
};

export default api;
