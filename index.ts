import "dotenv/config";
import express from "express";
import cors from "cors";
import { db } from "./lib/index.js"; // Ensure the .js extension is there
import { sql } from "drizzle-orm";
import userRouter from "./routes/users.js";
import AllRouter from "./router.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Your Next.js URL
  credentials: true, // Allow cookies/auth headers
})); // Allows Next.js to access this API
app.use(express.json()); // Allows parsing JSON bodies

// Basic Health Check Route
app.get("/health", async (req, res) => {
  try {
    // Quick DB check
    await db.execute(sql`SELECT 1`);
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "DB Connection failed" });
  }
});

app.use('/apis', AllRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
