"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const registerUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log("=== REGISTER CONTROLLER DEBUG ===");
    console.log("Request body received:", JSON.stringify(req.body, null, 2));
    console.log("================================");
    const result = await auth_service_1.AuthServices.registerUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully!",
        data: result,
    });
});
const loginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.loginUser(req.body);
    const { user, accessToken, refreshToken } = result;
    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User successfully logged in!",
        data: {
            user,
            accessToken,
        },
    });
});
const handleOAuthLogin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.handleOAuthUser(req.body);
    const { user, accessToken, refreshToken } = result;
    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User successfully authenticated!",
        data: {
            user,
            accessToken,
        },
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    res.clearCookie("refreshToken");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged out successfully!",
        data: null,
    });
});
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset link sent to your email!",
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthServices.resetPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successfully!",
        data: result,
    });
});
const getCurrentUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userPayload = req.user;
    const result = await auth_service_1.AuthServices.getCurrentUser(userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully!",
        data: result,
    });
});
exports.AuthControllers = {
    registerUser,
    loginUser,
    handleOAuthLogin,
    logout,
    forgotPassword,
    resetPassword,
    getCurrentUser,
};
//# sourceMappingURL=auth.controller.js.map