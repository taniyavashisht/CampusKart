import otpGenerator from "otp-generator";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

let otpStore = {}; // temporary in-memory store (for dev only)

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStore[email] = otp;

    await sendEmail(
      email,
      "CampusKart OTP Verification",
      `<h3>Your OTP is: <b>${otp}</b></h3><p>It is valid for 5 minutes.</p>`
    );

    setTimeout(() => delete otpStore[email], 300000); // delete OTP after 5 mins

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email];
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otpStore[email] = otp;

    await sendEmail(
      email,
      "CampusKart Password Reset OTP",
      `<h3>Your OTP to reset password is: <b>${otp}</b></h3><p>Valid for 5 minutes.</p>`
    );

    setTimeout(() => delete otpStore[email], 300000);

    res.status(200).json({ message: "Password reset OTP sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!otpStore[email] || otpStore[email] !== otp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    delete otpStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
