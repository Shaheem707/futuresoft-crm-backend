import "dotenv/config";
import express from "express";
import cors from "cors";
import AllRouter from "./router.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Your Next.js URL
  credentials: true, // Allow cookies/auth headers
})); // Allows Next.js to access this API
app.use(express.json()); // Allows parsing JSON bodies
app.use(cookieParser()); // 🔹 NEW — must be after cors, before routes

app.use('/apis', AllRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
