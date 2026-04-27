import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

dotenv.config();


// ENV VALIDATION
const requiredEnv = ["JWT_SECRET", "DATABASE_URL"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Missing required env variable: ${env}`);
    process.exit(1);
  }
});

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
app.set("trust proxy", 1); // Important for rate limit behind proxy

const PORT = process.env.PORT || 5000;

// Security Headers & Compression
app.use(helmet());
app.use(compression());

// Global Rate Limiter: max 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict Rate Limiter for Auth: max 10 requests per hour per IP
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts from this IP, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS — restrict to frontend origin in production
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL)?.split(",") || ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Apply global rate limiting to all /api routes
app.use("/api", globalLimiter);

// API Routes
app.use("/api/auth", authLimiter, authRoutes); // Strict auth rate limiting
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

import { errorHandler } from "./middleware/errorHandler";
import { prisma, pool } from "./lib/prismaClient";
app.use(errorHandler);

// Graceful Shutdown
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });

  const shutdown = async () => {
    console.log("Shutting down server...");
    server.close(async () => {
      console.log("HTTP server closed");
      await prisma.$disconnect();
      await pool.end();
      console.log("Database connections closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  // Catch unhandled rejections
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    shutdown();
  });
}

// Export for Vercel serverless functions
export default app;

