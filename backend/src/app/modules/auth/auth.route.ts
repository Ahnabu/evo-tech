import express from "express";
import { AuthControllers } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { authLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateRequest(AuthValidation.registerValidation),
  AuthControllers.registerUser
);
router.post(
  "/login",
  authLimiter,
  validateRequest(AuthValidation.loginValidation),
  AuthControllers.loginUser
);
router.post("/oauth", authLimiter, AuthControllers.handleOAuthLogin);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post("/logout", AuthControllers.logout);
router.post(
  "/forgot-password",
  authLimiter,
  validateRequest(AuthValidation.forgotPasswordValidation),
  AuthControllers.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validateRequest(AuthValidation.resetPasswordValidation),
  AuthControllers.resetPassword
);
router.get("/me", auth(), AuthControllers.getCurrentUser);

export const AuthRoutes = router;
