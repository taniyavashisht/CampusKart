import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { configureChatSocket } from "./socket/chatSocket.js";

const app = express();
const server = createServer(app);

// ===== CONFIG =====
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const PORT = process.env.PORT || 4000;

// ===== SOCKET.IO SETUP =====
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ CALL SOCKET FUNCTION
configureChatSocket(io);

// ===== MONGODB =====
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ===== MIDDLEWARE =====
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chat", chatRoutes);

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("✅ CampusKart Backend is running");
});

// ===== START SERVER =====
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
