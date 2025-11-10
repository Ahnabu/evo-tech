import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import routes from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";

const app: Application = express();

// CORS configuration - Allow multiple origins
const allowedOrigins = Array.isArray(config.cors_origin) 
  ? config.cors_origin 
  : [config.cors_origin];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/v1", routes);

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
