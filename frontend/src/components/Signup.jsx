import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../services/Api";
import "../login.css";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }

    // ✅ VERY IMPORTANT: If email changes, reset OTP state
    if (e.target.name === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
      setOtpMessage("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setOtpMessage("Please enter a valid email first.");
      return;
    }

    setLoading(true);
    setOtpMessage("");

    try {
      const res = await authAPI.sendOtp({ email: formData.email });

      if (res.status === 200) {
        setOtpSent(true);
        setOtpMessage("✅ OTP sent to your email.");
      }
    } catch (err) {
      setOtpMessage(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setOtpMessage("");

    try {
      const res = await authAPI.verifyOtp({ email: formData.email, otp });

      if (res.status === 200) {
        setOtpVerified(true);
        setOtpMessage("✅ OTP verified successfully!");
      }
    } catch (err) {
      setOtpMessage(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (!otpVerified) {
      setErrors((prev) => ({
        ...prev,
        general: "Please verify your email with OTP before signing up.",
      }));
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { confirmPassword, mobile, ...payload } = formData;

      console.log("[Signup] submitting:", payload);

      const res = await authAPI.signup(payload);

      if (!res.data.success) throw new Error(res.data.message);

      alert("✅ Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again.";

      console.error("[Signup] error:", msg);
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card signup-card">
        <h2 className="login-title">Join CampusKart</h2>

        {errors.general && <div className="error-message">{errors.general}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username *</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error-text">{errors.username}</span>}

          <label>Email *</label>
          <div className="otp-email-group">
            <input
              type="email"
              name="email"
              placeholder="your.email@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {!otpSent && (
              <button type="button" className="otp-btn" onClick={handleSendOtp}>
                Send OTP
              </button>
            )}
          </div>

          {otpSent && !otpVerified && (
            <div className="otp-verify-group">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button type="button" className="verify-btn" onClick={handleVerifyOtp}>
                Verify OTP
              </button>

              <button type="button" className="resend-btn" onClick={handleSendOtp}>
                Resend
              </button>
            </div>
          )}

          {otpMessage && <p className="otp-message">{otpMessage}</p>}

          <label>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
