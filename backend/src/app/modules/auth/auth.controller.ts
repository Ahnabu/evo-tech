import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req, res) => {
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

export const AuthControllers = {
  registerUser,
  loginUser,
  handleOAuthLogin,
  logout,
};
