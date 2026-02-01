import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";
import { globalLimiter } from "./app/middlewares/rateLimiter";

const app: Application = express();

// CORS configuration - Allow multiple origins
const allowedOrigins = Array.isArray(config.cors_origin)
  ? config.cors_origin
  : [config.cors_origin];

// Log allowed origins for debugging
console.log("Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === "*") return true;
        if (allowed === origin) return true;
        // Handle wildcards like *.vercel.app
        if (allowed.includes("*")) {
          const pattern = allowed.replace(/\*/g, ".*");
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Length", "X-Requested-With"],
    maxAge: 86400, // 24 hours
  })
);

// Handle preflight requests explicitly
app.options("*", cors());
app.use(cookieParser());

// Apply global rate limiter to all requests
//app.use(globalLimiter);

// Parser with size limits to handle large payloads (e.g., product images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API routes
app.use("/api/v1", routes);
app.use("/api", routes); // Additional mount point for legacy/shorthand requests

// Health check route for monitoring
app.get("/health", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// Testing route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to the Evo-Tech E-commerce API",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(globalErrorHandler);

// Handle not found
app.use(notFound);

export default app;
