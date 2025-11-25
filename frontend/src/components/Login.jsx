import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { authAPI } from "../services/Api";
import "../login.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("[login] submitting:", formData);
      const res = await authAPI.login(formData);
      const { token, user, success } = res.data;

      if (!success) throw new Error(res.data.message || "Login failed");
      if (!token) throw new Error("No token received from server");

      // ✅ Save login info in context and localStorage
      login(token, user);

      // ✅ Refresh header UI instantly
      window.dispatchEvent(new Event("storage"));

      alert(`Welcome back, ${user.name || user.username}!`);
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect") || "/";
      navigate(redirect);
    } catch (err) {
      console.error("[login error]", err);
      const msg = err.response?.data?.message || err.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login to CampusKart</h2>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username *</label>
          <input
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <label>Password *</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="forgot-link"
          onClick={() => setShowForgot(true)}
          style={{
            marginTop: "10px",
            textAlign: "center",
            color: "var(--accent-primary)",
            cursor: "pointer",
          }}
        >
          Forgot Password?
        </p>

        <p className="signup-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Signup
          </Link>
        </p>
      </div>

      {/* ✅ Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------
   Forgot Password Modal Component (Inline for simplicity)
------------------------------------------------------------ */
function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await authAPI.forgotPassword({ email });
      setStep(2);
      setMessage("OTP sent to your registered email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setMessage("Enter OTP and new password.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await authAPI.resetPassword({ email, otp, newPassword });
      setStep(3);
      setMessage("Password reset successful! You can now log in.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP or error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 className="modal-title">Forgot Password</h3>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {step === 1 && (
          <>
            <p className="modal-text">Enter your registered email to receive an OTP.</p>
            <input
              className="modal-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button className="modal-btn" onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="modal-text">Check your email for the OTP.</p>
            <input
              className="modal-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
            <input
              className="modal-input"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button className="modal-btn" onClick={handleResetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="modal-text">{message}</p>
            <button className="modal-btn" onClick={onClose}>
              Close
            </button>
          </>
        )}

        {message && <p className="modal-message">{message}</p>}
      </div>
    </div>
  );
}
