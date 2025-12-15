import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// 🔹 Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Middlewares
app.use(express.json());
app.use(cors());

// 🔹 API Routes
import authRoutes from "./routes/auth.js";
app.use("/auth", authRoutes);

import postRoutes from "./routes/posts.js";
app.use("/posts", postRoutes);

import followRoutes from "./routes/follow.js";
app.use("/follow", followRoutes);

import feedRoutes from "./routes/feed.js";
app.use("/feed", feedRoutes);

import userRoutes from "./routes/users.js";
app.use("/users", userRoutes);

// 🔹 Serve Angular frontend
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Angular routing support
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Render compatible PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
