import express from "express";
import { DashboardControllers } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Admin dashboard routes
router.get(
  "/stats",
  auth(USER_ROLE.ADMIN),
  DashboardControllers.getDashboardStats
);

router.get(
  "/sales-data",
  auth(USER_ROLE.ADMIN),
  DashboardControllers.getSalesData
);

router.get(
  "/recent-orders",
  auth(USER_ROLE.ADMIN),
  DashboardControllers.getRecentOrders
);

router.get(
  "/top-products",
  auth(USER_ROLE.ADMIN),
  DashboardControllers.getTopProducts
);

export const DashboardRoutes = router;