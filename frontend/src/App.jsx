// frontend/src/App.jsx
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateProduct from "./components/Products/CreateProduct";
import MySpace from "./components/MySpace/MySpace";
import Chat from "./components/Chat";
import Marketplace from "./components/Products/Marketplace";
import EditProduct from "./components/Products/EditProduct";


import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthModal from "./components/Auth/AuthModal";

export default function App() {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState("/");

  const showHeaderFooter = location.pathname === "/";

  useEffect(() => {
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest && e.target.closest("a");
      if (!anchor) return;

      try {
        const url = new URL(anchor.href);

        if (
          url.pathname === "/create-product" &&
          !localStorage.getItem("token")
        ) {
          e.preventDefault();
          setRedirectAfterAuth("/create-product");
          setShowAuthModal(true);
        }
      } catch {}
    };

    document.addEventListener("click", handleGlobalClick, true);
    return () =>
      document.removeEventListener("click", handleGlobalClick, true);
  }, []);

  const RequireAuth = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      const redirect = encodeURIComponent("/create-product");
      return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }
    return children;
  };

  return (
    <div className="App">
      {showHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Marketplace */}
        <Route path="/products" element={<Marketplace />} />

        <Route
          path="/create-product"
          element={
            <RequireAuth>
              <CreateProduct />
            </RequireAuth>
          }
        />

        <Route path="/myspace" element={<MySpace />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />


        {/* ✅ CORRECT CHAT ROUTE */}
        
      </Routes>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectTo={redirectAfterAuth}
        />
      )}

      {showHeaderFooter && <Footer />}
    </div>
  );
}
