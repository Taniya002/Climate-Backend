import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import farmQueryRoutes from "./routes/farmQueryRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { apiLimiter } from "./security/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(express.json({ limit: "100kb" }));

app.use("/api", healthRoutes);
app.use("/api", apiLimiter, farmQueryRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`Climate guard backend running on port ${PORT}`);
});
