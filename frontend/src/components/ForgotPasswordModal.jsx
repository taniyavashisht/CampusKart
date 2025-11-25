import React, { useState } from "react";
import API from "../utils/api";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: ask email, 2: otp+new pass, 3: done
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const sendResetOtp = async () => {
    if (!email) return setMsg("Please enter your registered email.");
    setLoading(true); setMsg("");
    try {
      await API.post("/auth/forgot-password", { email });
      setStep(2);
      setMsg("OTP sent to your email.");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp || !newPassword) return setMsg("Enter OTP and new password.");
    setLoading(true); setMsg("");
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword });
      setStep(3);
      setMsg("Password reset successful! You can now log in.");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Invalid OTP or error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0"
      style={{ background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div className="card-dark" style={{ width: "100%", maxWidth: 480, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800 }}>Forgot Password</h3>
          <button onClick={onClose} className="link-accent">Close</button>
        </div>

        {step === 1 && (
          <>
            <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>
              Enter your registered email. We’ll send you a one-time OTP.
            </p>
            <input
              className="input-dark"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <button className="btn-accent" onClick={sendResetOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>
              Check your email for the OTP, then set your new password.
            </p>
            <input
              className="input-dark"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <input
              className="input-dark"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-success" onClick={resetPassword} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button className="btn-accent" onClick={sendResetOtp} disabled={loading}>
                Resend OTP
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div>
            <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>
              Password updated successfully. You can now log in with your new password.
            </p>
            <button className="btn-success" onClick={onClose}>Done</button>
          </div>
        )}

        {msg && <p style={{ marginTop: 12, color: "var(--text-secondary)" }}>{msg}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
