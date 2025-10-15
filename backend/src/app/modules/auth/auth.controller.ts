import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req, res) => {
  console.log("=== REGISTER CONTROLLER DEBUG ===");
  console.log("Request body received:", JSON.stringify(req.body, null, 2));
  console.log("================================");
  
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { user, accessToken, refreshToken } = result;

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User successfully logged in!",
    data: {
      user,
      accessToken,
    },
  });
});

const handleOAuthLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.handleOAuthUser(req.body);
  const { user, accessToken, refreshToken } = result;

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User successfully authenticated!",
    data: {
      user,
      accessToken,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged out successfully!",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent to your email!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  const userPayload = req.user as { _id: string; email: string; role: string };
  const result = await AuthServices.getCurrentUser(userPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully!",
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  handleOAuthLogin,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
