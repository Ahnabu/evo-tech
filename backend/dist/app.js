"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
// CORS configuration - Allow multiple origins
const allowedOrigins = Array.isArray(config_1.default.cors_origin)
    ? config_1.default.cors_origin
    : [config_1.default.cors_origin];
// Log allowed origins for debugging
console.log('Allowed CORS Origins:', allowedOrigins);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin)
            return callback(null, true);
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed === '*')
                return true;
            if (allowed === origin)
                return true;
            // Handle wildcards like *.vercel.app
            if (allowed.includes('*')) {
                const pattern = allowed.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`);
                return regex.test(origin);
            }
            return false;
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
}));
// Handle preflight requests explicitly
app.options('*', (0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use("/api/v1", routes_1.default);
// Health check route for monitoring
app.get("/health", (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.default.NODE_ENV,
    });
});
// Testing route
app.get("/", (req, res, next) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Welcome to the Evo-Tech E-commerce API",
        timestamp: new Date().toISOString(),
    });
});
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle not found
app.use(notFound_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map