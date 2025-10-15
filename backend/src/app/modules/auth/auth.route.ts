import express from "express";
import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post("/register", AuthControllers.registerUser);
router.post("/login", AuthControllers.loginUser);
router.post("/oauth", AuthControllers.handleOAuthLogin);
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
